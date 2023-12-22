import functions_framework
import firebase_admin
from firebase_admin import credentials, firestore
import requests
import pendulum
from firebase_functions import https_fn, options
from google.cloud.firestore_v1.base_query import FieldFilter


cred = credentials.Certificate('serviceAccount.json')
app = firebase_admin.initialize_app(cred)
db = firestore.client()


def fetch_api_response(API_URL, restaurant_id):
    url = API_URL + restaurant_id
    response = requests.get(url)
    return response.json()

def get_table_map(restaurant_id):
    
    # map = {
    #     "T1": 6,
    #     "T2": 4,
    #     "T3": 8,
    #     "T4": 4,
    # }
    response = fetch_api_response("https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants/", restaurant_id)
    table_map = response["Item"]["Tables"]
    return table_map


def flatten_list(nested_list):
    flat_list = []
    for item in nested_list:
        if isinstance(item, list):
            flat_list.extend(flatten_list(item))
        else:
            flat_list.append(item)
    return flat_list


def get_unavailable_tables_db(restaurant_id, date, time):

    collection = db.collection("Reservation")
    query = collection.where(filter=FieldFilter("restaurant_id", "==", restaurant_id)).where(filter=FieldFilter("date", "==", date)).where(filter=FieldFilter("time", "==", time))
    table_ids = []

    for doc in query.stream():
        data = doc.to_dict()
        if "table_ids" in data:
            table_ids.extend(data["table_ids"]) 
    
    table_ids = flatten_list(table_ids)
    return table_ids


def assign_tables(table_map, num_guests, unavailable_tables):
    
    tables_assigned = []
    remaining_guests = num_guests

    for table_id, capacity in table_map.items():
        
        if table_id not in unavailable_tables:
            if remaining_guests <= 0:
                break

            if remaining_guests >= capacity:
                tables_assigned.append(table_id)
                remaining_guests -= capacity
            else:
                tables_assigned.append(table_id)
                remaining_guests = 0

    if remaining_guests == 0:
        return tables_assigned
    else:
        return []

@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["post", "get"],
    )
)
@functions_framework.http
def update_reservation(request):
    try:
        request_data = request.get_json()
        if not request_data:
            return {
            "ok": "false",
            "message": "Invalid Request data!",
            "status_code": 400
            }
        
        reservation_id = request_data.get("reservation_id")

        def get_reservation_data(reservation_id):
            collection = db.collection('Reservation')
            doc_ref = collection.document(reservation_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            else:
                return None

        restaurant_id = get_reservation_data(reservation_id).get("restaurant_id")
        
        if request_data.get("date") or request_data.get("time") or request_data.get("num_guests"):
            curr_datetime = pendulum.now().in_timezone("America/Halifax").format("YYYY-MM-DD HH:mm:ss")
            curr_date = curr_datetime.split(" ")[0]
            ch, cm, cs = curr_datetime.split(" ")[-1].split(":")
            print(curr_date, ch, cm, cs)
            
            if request_data.get("date") == curr_date:
                print("Here")
                time = request_data.get("time").split("-")[0]
                rh,rm = time.split(":")
                curr_time = pendulum.time(int(ch),int(cm),int(cs))
                reservation_time = pendulum.time(int(rh),int(rm),0)
                time_diff_arr = reservation_time.diff_for_humans(curr_time).split(" ")
                print(time_diff_arr, "aa")
                if time_diff_arr[2] == "before" or time_diff_arr[1] in ["seconds", "minutes", "second", "minute"]:
                    print("Here")
                    return {
                        "ok": "false",
                        "message": f"Sorry, reservations cannot be updated less than an hour before the reservation time.",
                        "status_code": 400
                    }
                
            table_map = get_table_map(restaurant_id)
            if table_map is None:
                return {
                "ok": "false",
                "message": "Unable to retrieve table map, check restaurant id!",
                "status_code": 500
                }

            unavailable_tables = get_unavailable_tables_db(restaurant_id, request_data.get('date'), request_data.get('time'))
            assigned_tables = assign_tables(table_map, request_data.get('num_guests'), unavailable_tables)
        
            if len(assigned_tables) == 0:
                return {
            "ok": "true",
            "message": f"Sorry, No tables avaiable on selected date & time for {request_data.get('num_guests')} guests.",
            "status_code": 200
            }
        
            collection = db.collection('Reservation')
            reservation_ref = collection.document(reservation_id)
            reservation_ref.update({"date": request_data.get("date"),
                                    "time": request_data.get("time"),
                                    "num_guests": request_data.get("num_guests"),
                                    "table_ids": assigned_tables, 
                                    "additional_req": request_data.get("additional_req"),
                                    "created_at": firestore.SERVER_TIMESTAMP})
            
        return {
        "ok": "true",
        "message": "Reservation Updated successfully!",
        "data": {
            "reservation_id": reservation_id,
            "assigned_tables": assigned_tables
        },
        "status_code": 200
        }
    
    except Exception as e:
        return {
            "ok": "false",
            "message": f"Could not update reservation! Error: {e}",
            "status_code": 500
        }



"""
table_ids can be multiple.
"""

class Reservation:

    def __init__(self,
                 user_id,
                 restaurant_id,
                 num_guests,
                 date,
                 time,
                 additional_req,
                 table_ids,
                 status,
                 created_at
                 ):

        self.user_id = user_id
        self.restaurant_id = restaurant_id
        self.num_guests = num_guests
        self.date = date
        self.time = time
        self.additional_req = additional_req
        self.table_ids = table_ids
        self.status = status
        self.created_at = created_at
    
    
    @staticmethod
    def from_dict(src):

        req = Reservation(src["user_id"],
                          src["restaurant_id"],
                          src["num_guests"],
                          src["date"],
                          src["time"])
        
        if "additional_req" in src:
            req.addition_req = src["additional_req"]

        if "table_ids" in src:
            req.table_id = src["table_ids"]

        if "status" in src:
            req.status = src["status"]
    
        if "created_at" in src:
            req.created_at = src["created_at"]

        return req
    

    def to_dict(self):

        dest = {
            "user_id": self.user_id,
            "restaurant_id": self.restaurant_id,
            "num_guests": self.num_guests,
            "date": self.date,
            "time": self.time
        }

        if self.additional_req:
            dest["additional_req"] = self.additional_req

        if self.table_ids:
            dest["table_ids"] = self.table_ids

        if self.status:
            dest["status"] = self.status
    
        if self.created_at:
            dest["created_at"] = self.created_at

        return dest
    

    def __repr__(self) -> str:
        
        return f"Reservation_Request(\
            user_id = {self.user_id}, \
            restaurant_id = {self.restaurant_id}, \
            number of guests = {self.num_guests}, \
            date = {self.date}, \
            time = {self.time}, \
            additional requests = {self.additional_req},\
            assigned table(s) = {self.table_ids}, \
            status = {self.status} \
            created_at = {self.created_at} \
            )"
        

"""
{
  "restaurant_id": "R1",
  "user_id": "u1",
  "num_guests": 7,
  "date": "2013-10-17",
  "time": "18:00-19:00",
  "additional_req": "abc"
}
"""