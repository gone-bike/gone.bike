import scrapy

from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import Rule
from scrapy.http import Request
from scrapy.loader import ItemLoader
from bikeregister.items import BikeregisterItem
from itemloaders.processors import TakeFirst, MapCompose, Join


class BikeregisterSpider(scrapy.spiders.CrawlSpider):
    name = 'bikeregister'
    allowed_domains = ['www.bikeregister.com','bikeregister.com']
    start_urls = ['https://www.bikeregister.com/stolen-bikes']

    handle_httpstatus_list = [400, 403, 404, 500, 502, 503, 504, 200]

    custom_settings = {
        # 'CLOSESPIDER_ITEMCOUNT' : 10,
        # 'LOG_FILE': 'logs/pageavailability.log',
        'LOG_LEVEL': 'DEBUG'
    }

    rules = (
        Rule(
            LinkExtractor(
                allow=('/stolen-bikes'),
                tags='a',
                attrs='href',
                unique=True,
                restrict_css=('#app > main > section.tw-py-12.tw-bg-gray-200 > div > div.tw-w-full.tw-flex.tw-justify-end.tw-mt-8 > nav > ul')
            ),
            callback='parse_listing',
            follow=True
        ),
        Rule(
            LinkExtractor(
                allow=('/stolen-bikes'),
                tags='a',
                attrs='href',
                unique=True,
                restrict_css=('#app > main > section.tw-py-12.tw-bg-gray-200 > div > div.tw-flex.tw-flex-wrap.tw--m-3')
            ),
            callback='parse_item',
            follow=True

        )
    )


    def parse_item(self, response):

        l = ItemLoader(item=BikeregisterItem(), response=response)
        l.add_css(
            field_name='theft_date',
            css='#app > main > section:nth-child(3) > div > div > div > div:nth-child(1) > div.tw-font-bold.tw-text-lg::text',
        )
        l.add_css(
            field_name='serial_number',
            css='#app > main > section.tw-bg-gray-200.tw-py-6 > div > div.tw-rounded-lg.tw-bg-white.tw-shadow.tw-flex.tw-flex-col.sm\:tw-flex-row.tw-overflow-hidden.tw-mb-3 > div.sm\:tw-w-3\/5.tw-p-6.tw-flex.tw-flex-col > div > div > div:nth-child(5) > div:nth-child(2)::text'
        )

        l.add_css(
            field_name='colors',
            css='#app > main > section.tw-bg-gray-200.tw-py-6 > div > div.tw-rounded-lg.tw-bg-white.tw-shadow.tw-flex.tw-flex-col.sm\:tw-flex-row.tw-overflow-hidden.tw-mb-3 > div.sm\:tw-w-3\/5.tw-p-6.tw-flex.tw-flex-col > div > div > div:nth-child(4) > div:nth-child(2)::text',
        )
        l.add_css(
            field_name='location_address_raw',
            css='#app > main > section:nth-child(3) > div > div > div > div:nth-child(3) > div.tw-font-bold.tw-text-lg::text',
        )
        l.add_css(
            field_name='bike_brand',
            css='#app > main > section.tw-bg-gray-200.tw-py-6 > div > div.tw-rounded-lg.tw-bg-white.tw-shadow.tw-flex.tw-flex-col.sm\:tw-flex-row.tw-overflow-hidden.tw-mb-3 > div.sm\:tw-w-3\/5.tw-p-6.tw-flex.tw-flex-col > div > div > div:nth-child(1) > div:nth-child(2)::text',
        )
        l.add_css(
            field_name='main_photo',
            css='#app > main > section.tw-bg-gray-200.tw-py-6 > div > div.tw-rounded-lg.tw-bg-white.tw-shadow.tw-flex.tw-flex-col.sm\:tw-flex-row.tw-overflow-hidden.tw-mb-3 > div.tw-h-32.sm\:tw-h-auto.sm\:tw-w-2\/5.tw-bg-cover.tw-bg-center.tw-bg-no-repeat > a::attr(href)',
        )

        l.add_xpath(
            field_name='description',
            xpath='//*[@id="app"]/main/section[2]/div/div[2]/div[2]/div/div/div[7]/div[2]/text()'
            # css='#app > main > section.tw-bg-gray-200.tw-py-6 > div > div.tw-rounded-lg.tw-bg-white.tw-shadow.tw-flex.tw-flex-col.sm\:tw-flex-row.tw-overflow-hidden.tw-mb-3 > div.sm\:tw-w-3\/5.tw-p-6.tw-flex.tw-flex-col > div > div > div.tw-text-sm.tw-w-full.tw-mt-8 > div:nth-child(2)::text'
        )

        l.add_value(
            field_name='url',
            value=response.url
        )
        l.add_css(
            field_name='bike_model',
            css='#app > main > section.tw-bg-gray-200.tw-py-6 > div > div.tw-rounded-lg.tw-bg-white.tw-shadow.tw-flex.tw-flex-col.sm\:tw-flex-row.tw-overflow-hidden.tw-mb-3 > div.sm\:tw-w-3\/5.tw-p-6.tw-flex.tw-flex-col > div > div > div:nth-child(2) > div:nth-child(2)::text'
        )
        # l.add_xpath("name", '//div[@class="product_title"]')
        # l.add_xpath("price", '//p[@id="price"]')
        # l.add_css("stock", "p#stock")
        # l.add_value("last_updated", "today")  # you can also use literal values
        yield l.load_item()

