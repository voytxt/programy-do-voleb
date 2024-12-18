import {useData} from '@/stores/data';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import { type, date, number, color } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';
import { defineAsyncComponent } from 'vue';

export default {
	name: 'party-polls',
	props: ['VSTRANA', 'color', 'isCoalition'],
	data: function () {
		return {
			cdn,
			agency: [{color: '#d4b655', name: 'Kantar'}, {color: '#21BBE1', name: 'Median'}, {color: '#D75F5F', name: 'STEM'}, {color: '#1964aa', name: 'NMS Market Research'}], // 'CVVM', 'Data Collect', 'Ipsos',
			agencySelected: null,
			width: 0,
			tick: 1,
			el: null,
			chartOptions: {
				chart: {
					height: 350,
					type: 'line',
					zoom: {
					  type: 'x',
					  enabled: true,
					  autoScaleYaxis: true
					},
					animations: {
					  enabled: true
					},
					locales: [{
					  "name": "cs",
					  "options": {
						"months": ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosines"],
						"shortMonths": ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvn", "Srp", "Zář", "Říj", "Lis", "Pro"],
						"days": ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
						"shortDays": ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
						"toolbar": {
							"exportToSVG": "Stáhnout SVG",
							"exportToPNG": "Stáhnout PNG",
							"exportToCSV": "Stáhnout CSV",
							"menu": "Menu",
							"selection": "Výběr",
							"selectionZoom": "Přiblížení",
							"zoomIn": "Přiblížit",
							"zoomOut": "Oddálit",
							"pan": "Posun",
							"reset": "Obnovit"
						}
					  }
					}],
					defaultLocale: "cs"
				},
				xaxis: {
				  type: 'datetime'
				},
				stroke: {
				  width: [5,5,4],
				  curve: 'smooth'
				},
				title: {
				  text: 'Od 6. října 2021'
				},
				markers: {
					size: 4
				},
			},
			series: []
		}
	},
	components: {
		VueApexCharts: defineAsyncComponent(() => import('vue3-apexcharts')),
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('polls/fetch/' + this.VSTRANA);

			if (d) {

				this.series = [];

				this.agency.forEach(agency => {
					var o = {
						name: agency.name,
						color: agency.color,
						data: []
					}	

					d.polls.forEach(poll => {
						if (poll.agency === agency.name) {

							var val = d.entries.find(x => x.poll === poll.id);

							if (val) {
								o.data.push({
									x: poll.datum,
									y: d.entries.find(x => x.poll === poll.id).value
								});
							}
						}
					});

					this.series.push(o);
				})
			}

			return d;
		}
	},
	methods: {
		date, number
	}
};
