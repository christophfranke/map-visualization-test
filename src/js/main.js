import Highcharts from  'highcharts/highmaps'
import map from '@highcharts/map-collection/custom/world.geo.json'
// console.log(map.features.map(feature => feature.id))

window.addEventListener('load', () => {
	const data = map.features.map(feature => ({
		'hc-key': feature.id.toLowerCase(),
		value: 10 * Math.random()
	}))

	Highcharts.mapChart('container', {
    series: [{
      data: data,
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
      max: 10
    },
	})
})