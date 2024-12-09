
import requests
import mysql.connector
from progress.bar import Bar

dbconfig = {
    "host":     "politicalstocktracker-db.mysql.database.azure.com",
    "database": "stock_tracker_db",
    "user":     "stocktrackerdb_admin",
    "passwd":   "MYSQL_DB_PW"
}

cnxpool = mysql.connector.pooling.MySQLConnectionPool(pool_name = "mypool",
                                                      pool_size = 3,
                                                      **dbconfig)

congressional_api_key = "FINNHUB_API_KEY"

path =  r"member_bioid.csv" # Contains every bioguideID for every politician (last updated 11/28)
bioIds = open(path).read().split(",")

# Request the data for a specified bioguideID
def request_member_data(bio_guide_id):
    response = requests.get(f"https://api.congress.gov/v3/member/{bio_guide_id}?api_key={congressional_api_key}")
    return response.json()

def find_most_recent_term(terms_data):
    most_recent_term = max(
        terms_data,
        key=lambda term: max(term["startYear"], term.get("endYear", term["startYear"])),
        default=None
    )
    return most_recent_term

def get_relevant_year(item):
    return item.get("endYear", item.get("startYear"))

query = """
        INSERT INTO people (firstName, lastName, middleName, isActive, photo, birthday, state)
        VALUES (%(firstName)s, %(lastName)s, %(middleName)s, %(isActive)s, %(photo)s, %(birthday)s, %(state)s)
        """

politician_query = """"
                  INSERT INTO politicians (id, position, affiliation, bioguideId) VALUES (%(id)s, %(position)s, %(affiliation)s, %(bioguideId)s)
"""

def extract_person_data(response):
    person_data = {
        "firstName":  response["firstName"],
        "lastName":   response["lastName"],
        "middleName": None,
        "isActive":   False,
        "photo":      response.get("depiction", {}).get("imageUrl", None),
        "birthday":   None,
        "state":      response["state"]
    }
    
    return person_data

def extract_politician_data(response):
    most_recent_term = find_most_recent_term(response["terms"])
    last_affiliation = max(response["partyHistory"], key=lambda x: x["startYear"])

    politician_data = {
        "id": None,
        "position":    most_recent_term["memberType"], 
        "affiliation": last_affiliation["partyName"],
        "bio": None,
        "bioguideId":  response["bioguideId"]
    }

    return politician_data

# Poll the API for data on all politicians
def populate_table():
    for member_id in Bar(f"Querying API").iter(bioIds):
        Bar.suffix = f"%(index)s/%(max)s ETA %(eta)ds (Adding member bioId: {member_id})"
        member_data = request_member_data(member_id)["member"]

        person_data = extract_person_data(person_data)
        politician_data = extract_politician_data(member_data)

        try:
            cnx1 = cnxpool.get_connection()
            cursor_object = cnx1.cursor()
            
            cursor_object.execute(query, person_data)

            politician_data["id"] = cursor_object.lastrowid
            cursor_object.execute(politician_query, politician_data)

            cnx1.commit()
            cursor_object.close()
            cnx1.close()

        except:
            print(f"Failed query on {member_id}")   