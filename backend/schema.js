const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    country: Joi.string().required(),
    location: Joi.string().required(),
    category: Joi.string().valid('Beachfront', 'Cabins', 'OMG!', 'Trending', 'Lakefront', 'Castles', 'Farms', 'Tiny homes', 'Pools', 'City').optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    maxGuests: Joi.number().min(1).optional(),
    bedrooms: Joi.number().min(0).optional(),
    beds: Joi.number().min(0).optional()
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

module.exports.bookingSchema = Joi.object({
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().min(Joi.ref('checkIn')).required(),
  guests: Joi.number().required().min(1),
  totalPrice: Joi.number().required().min(0)
});
