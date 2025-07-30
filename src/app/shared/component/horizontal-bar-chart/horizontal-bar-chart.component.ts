import { Component,OnInit,AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

interface BookData {
  year: string;
  fictionBooks: number;
  nonFictionBooks: number;
  historyBooks: number;
  scienceBooks: number;
  poetryBooks: number;
}

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.drawChart();
  }

  drawChart(): void {
    d3.select('#charts').selectAll('*').remove();
     const margin = { top: 50, right: 60, bottom: 40, left: 70 },
      width = 850 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select('#charts')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const data: BookData[] = [
  { year: '2008', fictionBooks: 44, nonFictionBooks: 53, scienceBooks: 12, historyBooks: 9, poetryBooks: 25 },
  { year: '2009', fictionBooks: 55, nonFictionBooks: 32, scienceBooks: 17, historyBooks: 7, poetryBooks: 12 },
  { year: '2010', fictionBooks: 41, nonFictionBooks: 33, scienceBooks: 11, historyBooks: 5, poetryBooks: 19 },
  { year: '2011', fictionBooks: 37, nonFictionBooks: 52, scienceBooks: 9,  historyBooks: 8, poetryBooks: 32 },
  { year: '2012', fictionBooks: 22, nonFictionBooks: 13, scienceBooks: 15, historyBooks: 6, poetryBooks: 25 },
  { year: '2013', fictionBooks: 43, nonFictionBooks: 23, scienceBooks: 11, historyBooks: 9, poetryBooks: 24 },
  { year: '2014', fictionBooks: 21, nonFictionBooks: 32, scienceBooks: 20, historyBooks: 4, poetryBooks: 10 }
];

    
    const keys = ['fictionBooks', 'nonFictionBooks', 'scienceBooks', 'historyBooks', 'poetryBooks'];
    const labels: Record<string, string> = {
      fictionBooks: 'fictionBooks',
      nonFictionBooks: 'nonFictionBooks',
      scienceBooks: 'ScienceBooks',
      historyBooks: 'HistoryBooks',
      poetryBooks: 'poetryBooks'
    };

    const colors = d3.scaleOrdinal<string>()
      .domain(keys)
      .range(['#2196f3', '#4caf50', '#ffc107', '#e95687ff', '#673ab7']);

    const stackedData = d3.stack().keys(keys)(data as any);

    const y = d3.scaleBand()
      .domain(data.map(d => d.year))
      .range([0, height])
      .padding(0.25);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => keys.reduce((sum, key) => sum + (d as any)[key], 0))!])
      .nice()
      .range([0, width]);

    
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${d}K`));

   
    svg.append('g')
      .call(d3.axisLeft(y));

  
    svg.selectAll('.layer')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('fill', d => colors(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
     .attr('y', d => y((d.data as any).year)!)
      .attr('x', d => x(d[0]))
      .attr('width', d => x(d[1]) - x(d[0]))
      .attr('height', y.bandwidth());


    svg.selectAll('.total-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', d => x(keys.reduce((sum, key) => sum + (d as any)[key], 0)) + 5)
      .attr('y', d => y(d.year)! + y.bandwidth() / 2 + 5)
      .text(d => keys.reduce((sum, key) => sum + (d as any)[key], 0))
      .attr('fill', '#000')
      .attr('font-weight', 'bold');

   
    svg.append('text')
      .attr('x', 0)
      .attr('y', -20)
      .text(' Books Sales')
      .attr('font-size', '18px')
      .attr('font-weight', '600');

  const tooltip = d3.select('#charts')
  .append('div')
  .style('position', 'absolute')
  .style('visibility', 'hidden')
  .style('background', '#fff')
  .style('padding', '6px 10px')
  .style('border', '1px solid #ccc')
  .style('border-radius', '4px')
  .style('font-size', '12px')
  .style('color', '#333')
  .style('box-shadow', '0 2px 6px rgba(0,0,0,0.2)');
svg.selectAll('.layer')
  .data(stackedData)
  .enter()
  .append('g')
  .attr('fill', d => colors(d.key))
  .selectAll('rect')
  .data(d => d.map(v => ({ ...v, key: (d as any).key }))) 
  .enter()
  .append('rect')
  .attr('y', d => y((d.data as any).year)!)
  .attr('x', d => x(d[0]))
  .attr('width', d => x(d[1]) - x(d[0]))
  .attr('height', y.bandwidth())
  .on('mouseover', (event, d: any) => {
    const value = d[1] - d[0];
    const label = labels[d.key];
    const year = d.data.year;
    tooltip
      .style('visibility', 'visible')
      .html(`<strong>${label}</strong><br>Year: ${year}<br>Books: ${value}`);
  })
  .on('mousemove', (event) => {
    tooltip
      .style('top', (event.pageY - 40) + 'px')
      .style('left', (event.pageX + 15) + 'px');
  })
  .on('mouseout', () => {
    tooltip.style('visibility', 'hidden');
  });

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 300}, -40)`);

    keys.forEach((key, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i % 3 * 150}, ${Math.floor(i / 3) * 20})`);

      legendItem.append('rect')
        .attr('width', 14)
        .attr('height', 14)
        .attr('fill', colors(key));

      legendItem.append('text')
        .attr('x', 18)
        .attr('y', 12)
        .text(labels[key])
        .style('font-size', '12px');
    });
  }
}
