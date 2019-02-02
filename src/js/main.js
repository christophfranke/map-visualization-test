import Highcharts from  'highcharts/highmaps'
import map from '@highcharts/map-collection/custom/world.geo.json'
import set1 from '../data/set1.json'
// console.log(map.features.map(feature => feature.id))
// console.log(data)

window.addEventListener('load', () => {
	// const data = map.features.map(feature => ({
	// 	'hc-key': feature.id.toLowerCase(),
	// 	value: 10 * Math.random()
	// }))

	const data = set1.map(([key, value]) => ({
		'hc-key': key.toLowerCase(),
		value: value > 0 ? value : null
	}))

	const max = data.map(point => point.value).reduce((max, value) => Math.max(max, value), 0)

	Highcharts.mapChart('container', {
		title: {
			text: 'Number of patents per country',
		},

    series: [{
      data,
      mapData: map,
      joinBy: 'hc-key',
      allAreas: true,
      name: 'Number of patents',
      states: {
        hover: {
          color: '#a4edba'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
      nullColor: '#e0e0e5'
    }],
    
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },

    colorAxis: {
      min: 1,
      max,
      minColor: '#f7f7f7',
      maxColor: '#e1000f',
      // type: 'logarithmic'
    },
	})
})