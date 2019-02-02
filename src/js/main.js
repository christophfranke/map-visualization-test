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
		value
	}))

	const max = data.map(point => point.value).reduce((max, value) => Math.max(max, value), 0)

	Highcharts.mapChart('container', {
    series: [{
      data,
      mapData: map,
      joinBy: 'hc-key',
      allAreas: false,
      name: 'Random data',
      states: {
        hover: {
          color: '#a4edba'
        }
      },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    }],
    
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },

    colorAxis: {
      min: 0,
      max
    },
	})
})