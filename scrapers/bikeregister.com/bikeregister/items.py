# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy
from itemloaders.processors import Join, MapCompose, TakeFirst


class BikeregisterItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()

    bike_brand = scrapy.Field(
        output_processor=TakeFirst()
    )
    bike_model = scrapy.Field(
        output_processor=TakeFirst()
    )
    main_photo = scrapy.Field(
        output_processor=TakeFirst()
    )
    description = scrapy.Field(
        output_processor=TakeFirst()
    )
    theft_date = scrapy.Field(
        output_processor=TakeFirst()
    )
    location_address_raw = scrapy.Field(
        output_processor=TakeFirst()
    )
    serial_number = scrapy.Field(
        output_processor=TakeFirst()
    )
    colors = scrapy.Field(
    )
    url = scrapy.Field(
        output_processor=TakeFirst()
    )

    pass
