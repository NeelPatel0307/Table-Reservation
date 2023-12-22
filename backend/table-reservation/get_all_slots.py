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

# I will get restaurant_id, date, num_guests from the request
# Need to get opening_hours, closing_hours, and table_map from the API

def define_slots(opening_hours, closing_hours, slot_duration):
    slots = []
    opening_hours = pendulum.parser.parse(opening_hours, tz="America/Halifax").time()
    closing_hours = pendulum.parser.parse(closing_hours, tz="America/Halifax").time()
    while opening_hours < closing_hours:
        slot = opening_hours.format("HH:mm") + "-" + opening_hours.add(minutes=slot_duration).format("HH:mm")
        slots.append(slot)
        opening_hours = opening_hours.add(minutes=slot_duration)
    return slots


def flatten_list(nested_list):
    flat_list = []
    for item in nested_list:
        if isinstance(item, list):
            flat_list.extend(flatten_list(item))
        else:
            flat_list.append(item)
    return flat_list


def get_availability_map(restaurant_id, date, slots, table_map):

    collection = db.collection("Reservation")
    query = collection.where(filter=FieldFilter("restaurant_id", "==", restaurant_id)).where(filter=FieldFilter("date", "==", date))
    total_capacity = 0
    availability_map = {}

    for _, v in table_map.items():
        total_capacity += v
    
    for slot in slots:
        table_ids = []
        query = query.where(filter=FieldFilter("time", "==", slot))
        if query.stream() == None:
            availability_map[slot] = 0
            continue

        for doc in query.stream():
            data = doc.to_dict()
            if "table_ids" in data:
                table_ids.extend(data["table_ids"])

        temp_sum = 0
        for table_id in table_ids:
            if table_id in table_map:
                temp_sum += int(table_map[table_id])
        
        availability_map[slot] = int(total_capacity - temp_sum)

    return availability_map


def fetch_api_response(API_URL, restaurant_id):
    url = API_URL + restaurant_id
    response = requests.get(url)
    return response.json()


def get_available_slots(restaurant_id, date, num_guests):

    response = fetch_api_response("https://m7kkjr68xi.execute-api.us-east-1.amazonaws.com/delop/restaurants/", restaurant_id)
    opening_hours = response["Item"]["OpeningHours"]
    closing_hours = response["Item"]["ClosingHours"]
    table_map = response["Item"]["Tables"]

    all_slots = define_slots(opening_hours, closing_hours, 60)
    availability_map = get_availability_map(restaurant_id, date, all_slots, table_map)

    available_slots = []
    for slot in all_slots:
        if availability_map[slot] >= int(num_guests):
            available_slots.append(slot)

    cur_date = pendulum.now(tz="America/Halifax").format("YYYY-MM-DD")
    if cur_date == date:
        # Remove any slots which are in the past or in the next 1 hour
        cur_time = pendulum.now(tz="America/Halifax").time()
        cur_time = cur_time.add(hours=1)
        cur_time = cur_time.format("HH:mm")
        available_slots = [slot for slot in available_slots if slot.split("-")[0] >= cur_time]
        
    return available_slots


@https_fn.on_request(
    cors=options.CorsOptions(
        cors_origins="*",
        cors_methods=["get", "post"],
    )
)
@functions_framework.http
def get_all_slots(request):

    try:
        request_data = request.get_json()
        if not request_data:
            return {
            "ok": "false",
            "message": "Invalid Request data!",
            "status_code": 400
            }

        restaurant_id = request_data.get('restaurant_id')
        date = request_data.get('date')
        num_guests = request_data.get('num_guests')

        available_slots = get_available_slots(restaurant_id, date, num_guests)
        if available_slots is None:
            return {
            "ok": "false",
            "message": "Could not fetch available slots!",
            "status_code": 500
            }

        return {
            "ok": "true",
            "data": {"available_slots": available_slots},
            "status_code": 200
        }

    except Exception as e:

        return {
            "ok": "false",
            "message": f"Could not fetch available slots: {e}",
            "status_code": 500
        }

