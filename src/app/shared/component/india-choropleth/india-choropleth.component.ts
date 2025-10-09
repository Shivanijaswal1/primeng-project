import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-india-choropleth',
  templateUrl: './india-choropleth.component.html',
  styleUrls: ['./india-choropleth.component.scss']
})
export class IndiaChoroplethComponent {
 @ViewChild('chart', { static: true }) private chartContainer!: ElementRef;
  @Input() stateData: Record<string, number> = {};

  private svg: any;
  private geojson: any;
  private width = 800;
  private height = 600;

  async ngAfterViewInit() {
    await this.loadMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stateData'] && this.geojson) {
      this.updateColors();
    }
  }

//   private async loadMap() {
//     this.svg = d3.select(this.chartContainer.nativeElement)
//       .append('svg')
//       .attr('width', this.width)
//       .attr('height', this.height);

//     const projection = d3.geoMercator()
//       .center([82.8, 22.5])
//       .scale(1000)
//       .translate([this.width / 2, this.height / 2]);

//     const path = d3.geoPath().projection(projection);

//     // 👀 try with local assets if remote fails
//     // const topo: any = await d3.json('assets/india_state.topojson');
//     // this.geojson = topojson.feature(topo, topo.objects.india_state);
//     d3.json('assets/india_state.topojson').then((topology: any) => {
//   const geojson = topojson.feature(topology, topology.objects.states);
//   // draw map...
// });


//     console.log('States loaded:', this.geojson.features.length);

//     this.svg.append('g')
//       .selectAll('path')
//       .data(this.geojson.features)
//       .enter()
//       .append('path')
//       .attr('d', path as any)
//       .attr('stroke', '#333')
//       .attr('stroke-width', 0.5)
//       .attr('class', 'state-path')
//       .attr('fill', 'lightgray'); // 👀 start with gray

//     this.updateColors();
//   }

private async loadMap() {
  this.svg = d3.select(this.chartContainer.nativeElement)
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height);

  const projection = d3.geoMercator()
    .center([82.8, 22.5])
    .scale(1000)
    .translate([this.width / 2, this.height / 2]);

  const path = d3.geoPath().projection(projection);

  const topology: any = await d3.json('assets/india_state.topojson');

  this.geojson = topojson.feature(topology, topology.objects.india_state);

  console.log('States loaded:', this.geojson.features.length);

  this.svg.append('g')
    .selectAll('path')
    .data(this.geojson.features)
    .enter()
    .append('path')
    .attr('d', path as any)
    .attr('stroke', '#333')
    .attr('stroke-width', 0.5)
    .attr('class', 'state-path')
    .attr('fill', 'lightgray');

  this.updateColors();
}

  private updateColors() {
    if (!this.geojson) return;
    const values = Object.values(this.stateData);
    const color = d3.scaleQuantize<string>()
      .domain([d3.min(values) || 0, d3.max(values) || 100])
      .range(['#deebf7', '#9ecae1', '#3182bd', '#08519c']);

    this.svg.selectAll('.state-path')
      .attr('fill', (d: any) => {
        const name = d.properties.st_nm || d.properties.STATE || d.properties.name;
        const val = this.stateData[name];
        return val ? color(val) : '#eee';
      });
  }
}
