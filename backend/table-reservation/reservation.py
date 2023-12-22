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
                 order_id,
                 created_at,
                 ):

        self.user_id = user_id
        self.restaurant_id = restaurant_id
        self.num_guests = num_guests
        self.date = date
        self.time = time
        self.additional_req = additional_req
        self.table_ids = table_ids
        self.status = status
        self.order_id = order_id
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

        if "order_id" in src:
            req.order_id = src["order_id"]

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

        if self.table_id:
            dest["table_ids"] = self.table_ids

        if self.status:
            dest["status"] = self.status

        if self.order_id:
            dest["order_id"] = self.order_id

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
            order_id = {self.order_id} \
            created_at = {self.created_at} \
            )"

        