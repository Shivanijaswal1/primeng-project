import {
  Component,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ServiceService } from 'src/app/core/service.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  @ViewChild('chartContainer') chartContainer: ElementRef | any;
  @Input() data: any;
  private svg: any;
  private width: number | any;
  private height: number | any;
  private radius: number | any;
  constructor(private _pieData: ServiceService) {}

  ngOnInit(): void {
    this._pieData.getDataPieChart().subscribe((data) => {
      this.data = data;
      this.createChart();
      this.updateChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  createChart(): void {
  this.width = 700;
  this.height = 400;
  this.radius = Math.min(this.width, this.height) / 2 - 100;

  d3.select(this.chartContainer.nativeElement).selectAll('*').remove(); 
  this.svg = d3
    .select(this.chartContainer.nativeElement)
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .append('g')
    .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);
}

updateChart(): void {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const pie = d3.pie<{ label: string; value: number }>()
    .value(d => d.value)
    .sort(null);

  const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
    .innerRadius(0)
    .outerRadius(this.radius);

  const outerArc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
    .innerRadius(this.radius * 1.2)
    .outerRadius(this.radius * 1.5);

  const arcsData = pie(this.data);
  const total = d3.sum(this.data, (d: any) => d.value);

  d3.select('body').selectAll('.tooltip-pie').remove();

  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip-pie')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.75)')
    .style('color', '#fff')
    .style('padding', '6px 10px')
    .style('border-radius', '4px')
    .style('font-size', '13px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  const arcs = this.svg.selectAll('path.arc').data(arcsData);
  arcs.enter()
    .append('path')
    .attr('class', 'arc')
    .merge(arcs)
    .attr('d', arc)
    .attr('fill', (d: any) => color(d.data.label))
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .on('mouseover', (event: any, d: any) => {
      tooltip
        .style('opacity', 1)
        .html(`<strong>${d.data.label}</strong><br/>Value: ${d.data.value}<br/>${((d.data.value / total) * 100).toFixed(1)}%`);
    })
    .on('mousemove', (event: any) => {
      tooltip
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`);
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  arcs.exit().remove();

  type LabeledArc = d3.PieArcDatum<{ label: string; value: number }> & {
    pos: [number, number];
    side: 'left' | 'right';
    angle: number;
  };

  const labelsData: LabeledArc[] = arcsData.map(d => {
    const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
    const pos: [number, number] = outerArc.centroid(d);
    pos[0] = this.radius * 1.4 * (midAngle < Math.PI ? 1 : -1);
    return {
      ...d,
      pos,
      side: midAngle < Math.PI ? 'right' : 'left',
      angle: midAngle
    };
  });
  const adjustYSpread = (labels: LabeledArc[], heightRange: [number, number]) => {
    const spacing = (heightRange[1] - heightRange[0]) / labels.length;
    labels.sort((a, b) => a.pos[1] - b.pos[1]);
    labels.forEach((label, i) => {
      label.pos[1] = heightRange[0] + spacing * i;
    });
  };

  const labelPadding = 20;
  adjustYSpread(labelsData.filter(d => d.side === 'right'), [-this.height / 2 + labelPadding, this.height / 2 - labelPadding]);
  adjustYSpread(labelsData.filter(d => d.side === 'left'), [-this.height / 2 + labelPadding, this.height / 2 - labelPadding]);

  const labels = this.svg.selectAll('text.label').data(labelsData);
  labels.enter()
    .append('text')
    .attr('class', 'label')
    .merge(labels)
    .attr('transform', (d: any) => `translate(${d.pos[0]}, ${d.pos[1]})`)
    .attr('dy', '0.35em')
    .attr('text-anchor', (d: any) => d.side === 'right' ? 'start' : 'end')
    .style('fill', '#333')
    .style('font-size', '12px')
    .style('font-family', 'Arial, sans-serif')
    .style('font-weight', '600')
    .text((d: any) => {
      const label = `${d.data.label}: ${d.data.value} (${((d.data.value / total) * 100).toFixed(1)}%)`;
      return label.length > 30 ? label.substring(0, 30) + '...' : label;
    });
  labels.exit().remove();

const polylines = this.svg.selectAll('polyline.polyline').data(labelsData);
polylines.enter()
  .append('polyline')
  .attr('class', 'polyline')
  .merge(polylines)
  .attr('points', (d: any) => {
    const posA = arc.centroid(d);      
    const posB = outerArc.centroid(d); 
    const posC = [...d.pos];          
    posB[1] = posC[1];
    return [posA, posB, posC];
  })
  
  .style('fill', 'none')
  .style('stroke', '#666')
  .style('stroke-width', '1.5px')
  .style('opacity', 0.8);
   polylines.exit().remove();
}

}
