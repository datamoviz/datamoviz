<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Map</h2>
          <div ref="map" class="map"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import * as d3 from 'd3';
  import Datamaps from 'datamaps';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'app-map',
    data() {
      return {
        countries: [],
        map: null
      };
    },
    methods: {
      countCountries(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/count/countries?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((json) => {
            this.countries = json;
          });
      },
      loadMap() {
        const convertData = {
          Afghanistan: 'AFG', 'Åland Islands': 'ALA', Albania: 'ALB', Algeria: 'DZA', 'American Samoa': 'ASM', Andorra: 'AND', Angola: 'AGO', Anguilla: 'AIA', Antarctica: 'ATA', 'Antigua and Barbuda': 'ATG', Argentina: 'ARG', Armenia: 'ARM', Aruba: 'ABW', Australia: 'AUS', Austria: 'AUT', Azerbaijan: 'AZE', Bahamas: 'BHS', Bahrain: 'BHR', Bangladesh: 'BGD', Barbados: 'BRB', Belarus: 'BLR', Belgium: 'BEL', Belize: 'BLZ', Benin: 'BEN', Bermuda: 'BMU', Bhutan: 'BTN', 'Bolivia (Plurinational State of)': 'BOL', 'Bonaire, Sint Eustatius and Saba': 'BES', 'Bosnia and Herzegovina': 'BIH', Botswana: 'BWA', 'Bouvet Island': 'BVT', Brazil: 'BRA', 'British Indian Ocean Territory': 'IOT', 'Brunei Darussalam': 'BRN', Bulgaria: 'BGR', 'Burkina Faso': 'BFA', Burundi: 'BDI', Cambodia: 'KHM', Cameroon: 'CMR', Canada: 'CAN', 'Cabo Verde': 'CPV', 'Cayman Islands': 'CYM', 'Central African Republic': 'CAF', Chad: 'TCD', Chile: 'CHL', China: 'CHN', 'Christmas Island': 'CXR', 'Cocos (Keeling) Islands': 'CCK', Colombia: 'COL', Comoros: 'COM', Congo: 'COG', 'Congo (Democratic Republic of the)': 'COD', 'Cook Islands': 'COK', 'Costa Rica': 'CRI', "Côte d'Ivoire": 'CIV', Croatia: 'HRV', Cuba: 'CUB', Curaçao: 'CUW', Cyprus: 'CYP', 'Czech Republic': 'CZE', Denmark: 'DNK', Djibouti: 'DJI', Dominica: 'DMA', 'Dominican Republic': 'DOM', Ecuador: 'ECU', Egypt: 'EGY', 'El Salvador': 'SLV', 'Equatorial Guinea': 'GNQ', Eritrea: 'ERI', Estonia: 'EST', Ethiopia: 'ETH', 'Falkland Islands (Malvinas)': 'FLK', 'Faroe Islands': 'FRO', Fiji: 'FJI', Finland: 'FIN', France: 'FRA', 'French Guiana': 'GUF', 'French Polynesia': 'PYF', 'French Southern Territories': 'ATF', Gabon: 'GAB', Gambia: 'GMB', Georgia: 'GEO', Germany: 'DEU', Ghana: 'GHA', Gibraltar: 'GIB', Greece: 'GRC', Greenland: 'GRL', Grenada: 'GRD', Guadeloupe: 'GLP', Guam: 'GUM', Guatemala: 'GTM', Guernsey: 'GGY', Guinea: 'GIN', 'Guinea-Bissau': 'GNB', Guyana: 'GUY', Haiti: 'HTI', 'Heard Island and McDonald Islands': 'HMD', 'Holy See': 'VAT', Honduras: 'HND', 'Hong Kong': 'HKG', Hungary: 'HUN', Iceland: 'ISL', India: 'IND', Indonesia: 'IDN', 'Iran (Islamic Republic of)': 'IRN', Iraq: 'IRQ', Ireland: 'IRL', 'Isle of Man': 'IMN', Israel: 'ISR', Italy: 'ITA', Jamaica: 'JAM', Japan: 'JPN', Jersey: 'JEY', Jordan: 'JOR', Kazakhstan: 'KAZ', Kenya: 'KEN', Kiribati: 'KIR', "Korea (Democratic People's Republic of)": 'PRK', 'Korea (Republic of)': 'KOR', Kuwait: 'KWT', Kyrgyzstan: 'KGZ', "Lao People's Democratic Republic": 'LAO', Latvia: 'LVA', Lebanon: 'LBN', Lesotho: 'LSO', Liberia: 'LBR', Libya: 'LBY', Liechtenstein: 'LIE', Lithuania: 'LTU', Luxembourg: 'LUX', Macao: 'MAC', 'Macedonia (the former Yugoslav Republic of)': 'MKD', Madagascar: 'MDG', Malawi: 'MWI', Malaysia: 'MYS', Maldives: 'MDV', Mali: 'MLI', Malta: 'MLT', 'Marshall Islands': 'MHL', Martinique: 'MTQ', Mauritania: 'MRT', Mauritius: 'MUS', Mayotte: 'MYT', Mexico: 'MEX', 'Micronesia (Federated States of)': 'FSM', 'Moldova (Republic of)': 'MDA', Monaco: 'MCO', Mongolia: 'MNG', Montenegro: 'MNE', Montserrat: 'MSR', Morocco: 'MAR', Mozambique: 'MOZ', Myanmar: 'MMR', Namibia: 'NAM', Nauru: 'NRU', Nepal: 'NPL', Netherlands: 'NLD', 'New Caledonia': 'NCL', 'New Zealand': 'NZL', Nicaragua: 'NIC', Niger: 'NER', Nigeria: 'NGA', Niue: 'NIU', 'Norfolk Island': 'NFK', 'Northern Mariana Islands': 'MNP', Norway: 'NOR', Oman: 'OMN', Pakistan: 'PAK', Palau: 'PLW', 'Palestine, State of': 'PSE', Panama: 'PAN', 'Papua New Guinea': 'PNG', Paraguay: 'PRY', Peru: 'PER', Philippines: 'PHL', Pitcairn: 'PCN', Poland: 'POL', Portugal: 'PRT', 'Puerto Rico': 'PRI', Qatar: 'QAT', Réunion: 'REU', Romania: 'ROU', 'Russian Federation': 'RUS', Rwanda: 'RWA', 'Saint Barthélemy': 'BLM', 'Saint Helena, Ascension and Tristan da Cunha': 'SHN', 'Saint Kitts and Nevis': 'KNA', 'Saint Lucia': 'LCA', 'Saint Martin (French part)': 'MAF', 'Saint Pierre and Miquelon': 'SPM', 'Saint Vincent and the Grenadines': 'VCT', Samoa: 'WSM', 'San Marino': 'SMR', 'Sao Tome and Principe': 'STP', 'Saudi Arabia': 'SAU', Senegal: 'SEN', Serbia: 'SRB', Seychelles: 'SYC', 'Sierra Leone': 'SLE', Singapore: 'SGP', 'Sint Maarten (Dutch part)': 'SXM', Slovakia: 'SVK', Slovenia: 'SVN', 'Solomon Islands': 'SLB', Somalia: 'SOM', 'South Africa': 'ZAF', 'South Georgia and the South Sandwich Islands': 'SGS', 'South Sudan': 'SSD', Spain: 'ESP', 'Sri Lanka': 'LKA', Sudan: 'SDN', Suriname: 'SUR', 'Svalbard and Jan Mayen': 'SJM', Swaziland: 'SWZ', Sweden: 'SWE', Switzerland: 'CHE', 'Syrian Arab Republic': 'SYR', 'Taiwan, Province of China': 'TWN', Tajikistan: 'TJK', 'Tanzania, United Republic of': 'TZA', Thailand: 'THA', 'Timor-Leste': 'TLS', Togo: 'TGO', Tokelau: 'TKL', Tonga: 'TON', 'Trinidad and Tobago': 'TTO', Tunisia: 'TUN', Turkey: 'TUR', Turkmenistan: 'TKM', 'Turks and Caicos Islands': 'TCA', Tuvalu: 'TUV', Uganda: 'UGA', Ukraine: 'UKR', 'United Arab Emirates': 'ARE', 'United Kingdom of Great Britain and Northern Ireland': 'GBR', 'United States of America': 'USA', 'United States Minor Outlying Islands': 'UMI', Uruguay: 'URY', Uzbekistan: 'UZB', Vanuatu: 'VUT', 'Venezuela (Bolivarian Republic of)': 'VEN', 'Viet Nam': 'VNM', 'Virgin Islands (British)': 'VGB', 'Virgin Islands (U.S.)': 'VIR', 'Wallis and Futuna': 'WLF', 'Western Sahara': 'ESH', Yemen: 'YEM', Zambia: 'ZMB', Zimbabwe: 'ZWE'
        };
        const aymen = [
          ['BLR', 75], ['BLZ', 43], ['RUS', 50], ['RWA', 88], ['SRB', 21], ['TLS', 43],
          ['REU', 21], ['TKM', 19], ['TJK', 60], ['ROU', 4], ['TKL', 44], ['GNB', 38],
          ['GUM', 67], ['GTM', 2], ['SGS', 95], ['GRC', 60], ['GNQ', 57], ['GLP', 53],
          ['JPN', 59], ['GUY', 24], ['GGY', 4], ['GUF', 21], ['GEO', 42], ['GRD', 65],
          ['GBR', 14], ['GAB', 47], ['SLV', 15], ['GIN', 19], ['GMB', 63], ['GRL', 56],
          ['ERI', 57], ['MNE', 93], ['MDA', 39], ['MDG', 71], ['MAF', 16], ['MAR', 8],
          ['MCO', 25], ['UZB', 81], ['MMR', 21], ['MLI', 95], ['MAC', 33], ['MNG', 93],
          ['MHL', 15], ['MKD', 52], ['MUS', 19], ['MLT', 69], ['MWI', 37], ['MDV', 44],
          ['MTQ', 13], ['MNP', 21], ['MSR', 89], ['MRT', 20], ['IMN', 72], ['UGA', 59],
          ['TZA', 62], ['MYS', 75], ['MEX', 80], ['ISR', 77], ['FRA', 54], ['IOT', 56],
          ['SHN', 91], ['FIN', 51], ['FJI', 22], ['FLK', 4], ['FSM', 69], ['FRO', 70],
          ['NIC', 66], ['NLD', 53], ['NOR', 7], ['NAM', 63], ['VUT', 15], ['NCL', 66],
          ['NER', 34], ['NFK', 33], ['NGA', 45], ['NZL', 96], ['NPL', 21], ['NRU', 13],
          ['NIU', 6], ['COK', 19], ['XKX', 32], ['CIV', 27], ['CHE', 65], ['COL', 64],
          ['CHN', 16], ['CMR', 70], ['CHL', 15], ['CCK', 85], ['CAN', 76], ['COG', 20],
          ['CAF', 93], ['COD', 36], ['CZE', 77], ['CYP', 65], ['CXR', 14], ['CRI', 31],
          ['CUW', 67], ['CPV', 63], ['CUB', 40], ['SWZ', 58], ['SYR', 96], ['SXM', 31]];
        const series = this.countries.map(item => [
          convertData[item._id.name], item.value
        ]);
        const dataset = {};
        const onlyValues = series.map(obj => obj[1]);
        const minValue = Math.min.apply(null, onlyValues);
        const maxValue = Math.max.apply(null, onlyValues);
        const paletteScale = d3.scaleLinear()
          .domain([minValue, maxValue])
          .range(['#E5F4EC', '#009946']); // green color
        series.forEach((item) => {
          const iso = item[0];
          const value = item[1];
          dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
        });
        return new Datamaps({
          element: this.$refs.map,
          projection: 'mercator',
          fills: { defaultFill: '#F5F5F5' },
          data: dataset,
          geographyConfig: {
            borderColor: '#DEDEDE',
            popupOnHover: true,
            highlightBorderWidth: 2,
            highlightFillColor(geo) {
              return geo.fillColor || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            popupTemplate(geo, data) {
              if (!data) {
                return;
              }
              ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br>Count: <strong>', data.numberOfThings, '</strong>',
                '</div>'].join('');
            }
          }
        });
      }
    },
    mounted() {
      this.countCountries().then(() => {
        this.loadMap();
      });
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.countCountries(filters);
      });
    }
  };

</script>

<style lang="scss" ref="stylesheet/scss">
  .map{
    height:600px;
  }
  .hoverinfo{
    position:absolute;
    top:0;
    left:0;
    width:100px;
    height:100px;
  }
</style>
