import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-detail.component.html',
  styleUrl: './team-detail.component.scss'
})
export class TeamDetailComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public team: any;
  public loading = false;

  constructor(private activeRoute: ActivatedRoute, private router: Router, private teamService: TeamService) { }

  ngOnInit(): void {
    this.getTeam();
  }

  getTeam(): void {
    this.loading = true;
    this.subscription.add(
      this.activeRoute.queryParams.subscribe((params: Params) => {
        this.teamService.getTeamDetail(params['name'])
          .pipe(finalize(() => this.loading = false))
          .subscribe(res => {
            this.team = res.teams[0];
          })
      }));
  }

  back(): void {
    this.router.navigate(['home']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
