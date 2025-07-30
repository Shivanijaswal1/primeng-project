import { Component } from '@angular/core';
import * as d3 from 'd3';
import { ServiceService, BarChartData } from 'src/app/core/service.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})

export class BarChartComponent {
  data: BarChartData[] = [];
  constructor(private _barchartService: ServiceService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this._barchartService.getDataBarChart().subscribe((res) => {
      this.data = res;
      this.drawChart();
    });
  }

//   // drawChart(): void {
// //     d3.select('#chart').selectAll('*').remove();
// //     const margin = { top: 20, right: 20, bottom: 30, left: 40 },
// //       width = 600 - margin.left - margin.right,
// //       height = 400 - margin.top - margin.bottom;

// //     const svg = d3
// //       .select('#chart')
// //       .append('svg')
// //       .attr('width', width + margin.left + margin.right)
// //       .attr('height', height + margin.top + margin.bottom)
// //       .append('g')
// //       .attr('transform', `translate(${margin.left},${margin.top})`);

// //     const x = d3
// //       .scaleBand()
// //       .domain(this.data.map((d) => d.label))
// //       .range([0, height])
// //       .padding(0.1);

// //     const y = d3
// //       .scaleLinear()
// //       .domain([0, d3.max(this.data, (d) => d.value)!])
// //       .nice()
// //       .range([width, 0]);
// //     svg
// //       .append('g')
// //       .attr('transform', `translate(0,${height})`)
// //       .call(d3.axisBottom(x));

// // svg.selectAll('.label')
// //   .data(this.data)
// //   .enter()
// //   .append('text')
// //   .attr('class', 'label')
// //   .attr('x', d => x(d.label)! + x.bandwidth() / 2)
// //   .attr('y', d => y(d.value) - 5)  
// //   .attr('text-anchor', 'middle')
// //   .attr('font-size', '12px')
// //   .attr('fill', '#000')
// //   .text(d => d.value);

// //     svg.append('g').call(d3.axisLeft(y));
// //     const tooltip = d3
// //       .select('body')
// //       .append('div')
// //       .style('position', 'absolute')
// //       .style('background', 'rgba(0, 0, 0, 0.7)')
// //       .style('color', '#fff')
// //       .style('padding', '6px 10px')
// //       .style('border-radius', '4px')
// //       .style('font-size', '14px')
// //       .style('pointer-events', 'none')
// //       .style('opacity', 0);

// //     svg
// //       .selectAll('.bar')
// //       .data(this.data)
// //       .enter()
// //       .append('rect')
// //       .attr('class', 'bar')
// //       .attr('x', (d) => x(d.label)!)
// //       .attr('y', (d) => y(d.value))
// //       .attr('width', x.bandwidth())
// //       .attr('height', (d) => height - y(d.value))
// //        .text((d) => Math.round(d.value * 100) / 100)
// //       .attr('text-anchor', 'middle')
// //       .attr('fill', 'steelblue')
// //       .on('mouseover', (event, d) => {
// //         tooltip
// //           .style('opacity', 1)
// //           .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`);
// //       })
// //       .on('mousemove', (event) => {
// //         tooltip
// //           .style('left', event.pageX + 10 + 'px')
// //           .style('top', event.pageY - 28 + 'px');
// //       })
// //       .on('mouseout', () => {
// //         tooltip.style('opacity', 0);
// //       });
// //   }


 drawChart(): void {
    d3.select('#chart').selectAll('*').remove();
    const margin = { top: 20, right: 20, bottom: 30, left: 100 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
    .scaleBand()
    .domain(this.data.map((d) => d.label))
    .range([0, height]) 
    .padding(0.1);

    const x = d3
    .scaleLinear()
    .domain([0, d3.max(this.data, (d) => d.value)!])
    .nice()
    .range([0, width]);


    //     const x = d3
//       .scaleBand()
//       .domain(this.data.map((d) => d.label))
//       .range([0, height])
//       .padding(0.1);

//     const y = d3
//       .scaleLinear()
//       .domain([0, d3.max(this.data, (d) => d.value)!])
//       .nice()
//       .range([width, 0]);

  svg.append('g').call(d3.axisLeft(y));
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

   const tooltip = d3
    .select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.7)')
    .style('color', '#fff')
    .style('padding', '6px 10px')
    .style('border-radius', '4px')
    .style('font-size', '14px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  svg
    .selectAll('.bar')
    .data(this.data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', (d) => y(d.label)!)
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('width', (d) => x(d.value))
    .attr('fill', 'steelblue')
    .on('mouseover', (event, d) => {
      tooltip
        .style('opacity', 1)
        .html(`<strong>${d.label}</strong><br/>Value: ${d.value}`);
    })
    .on('mousemove', (event) => {
      tooltip
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
    });

  svg
    .selectAll('.label')
    .data(this.data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', (d) => x(d.value) + 5)
    .attr('y', (d) => y(d.label)! + y.bandwidth() / 2 + 5)
    .attr('font-size', '12px')
    .attr('fill', '#000')
    .text((d) => d.value);
}

}
