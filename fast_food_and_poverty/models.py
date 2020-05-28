from .app import db


class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    index = db.Column(db.Integer, primary_key=True)
    restaurantName = db.Column(db.String(64))
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)
    address = db.Column(db.String(120))
    state = db.Column(db.String(2))
    metro = db.Column(db.String(64))

    def __repr__(self):
        return '<Restaurant %r>' % (self.name)
