import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../core/service.service';

@Component({
  selector: 'app-student-fee-detail',
  templateUrl: './student-fee-detail.component.html',
  styleUrls: ['./student-fee-detail.component.scss'],
})
export class StudentFeeDetailComponent implements OnInit {
  showChart = false;
  feeChartData: any;
  feeChartOptions: any;
  pendingCount: number = 0;
  completeCount: number = 0;

  constructor(private studentService: ServiceService) {}

  ngOnInit() {
    this.studentService.getStudent().subscribe((students: any[]) => {
      const pending  = students.filter((s) => s.selectedfees === 'Pending');
      const complete = students.filter((s) => s.selectedfees === 'complete');
      this.pendingCount  = pending.length;
      this.completeCount = complete.length;
      this.feeChartData = {
        labels: ['Pending Fee', 'Complete Fee'],
        datasets: [
          {
            data: [this.pendingCount, this.completeCount],
            backgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      };
      this.feeChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {legend: { position: 'bottom' }},
      };
      this.showChart = true;
      console.log('Chart ready', this.feeChartData);
    });
  }
  
}
