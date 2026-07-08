import { Component, Input, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { MonthlyAnalytics } from '../../../core/models/analytics.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-income-expense-chart',
  standalone: true,
  imports: [],
  templateUrl: './income-expense-chart.html',
})
export class IncomeExpenseChart implements OnChanges {
  @Input() analytics: MonthlyAnalytics[] = [];
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;

  private chart: Chart | null = null;

  ngOnChanges() {
    if (this.analytics.length && this.chartCanvas) {
      this.renderChart();
    }
  }

  private renderChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const labels = [
      'Sty',
      'Lut',
      'Mar',
      'Kwi',
      'Maj',
      'Cze',
      'Lip',
      'Sie',
      'Wrz',
      'Paź',
      'Lis',
      'Gru',
    ];

    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Zarobki',
            data: this.analytics.map((r) => r.totalIncome),
            borderColor: '#10c67a',
            backgroundColor: 'rgba(16,198,122,0.1)',
            tension: 0,
            pointRadius: 4,
          },
          {
            label: 'Wydatki',
            data: this.analytics.map((r) => r.totalExpenses),
            borderColor: '#f94770',
            backgroundColor: 'rgba(249,71,112,0.1)',
            tension: 0,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#a1a1aa' } },
        },
        scales: {
          x: { ticks: { color: '#a1a1aa' }, grid: { color: '#27272a' } },
          y: { ticks: { color: '#a1a1aa' }, grid: { color: '#27272a' } },
        },
      },
    });
  }
}
