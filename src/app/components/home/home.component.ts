import { Component, OnDestroy, OnInit } from '@angular/core';
import { TeamCardComponent } from '../team-card/team-card.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { Subscription, distinctUntilChanged, finalize } from 'rxjs';
import { League } from '../../models/league';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TeamCardComponent, NgbDropdownModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  public allLeagues: League[] = [];
  public tempAllLeagues: League[] = [];
  public teams = [];
  public selectedLeague: League | undefined;
  public loading = false;

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.getAllLeagues();
    this.subscribeToSelectedLeague();
  }

  subscribeToSelectedLeague(): void {
    this.subscription.add(
      this.teamService.getSelectedLeague()
        .pipe(distinctUntilChanged())
        .subscribe(league => {
          this.selectedLeague = league;

          if (this.selectedLeague) {
            this.loading = true;
            this.subscription.add(
              this.teamService.getTeams(this.selectedLeague.strLeague)
                .pipe(finalize(() => this.loading = false))
                .subscribe(res => {
                  this.teams = res.teams;
                })
            );
          }
        })
    )
  }

  getAllLeagues(): void {
    this.subscription.add(
      this.teamService.searchLeagues().subscribe(res => {
        this.allLeagues = res.leagues.filter((league: League) => league.strSport == 'Soccer');
        this.tempAllLeagues = this.allLeagues;
      })
    );
  }

  search(key: string): void {
    if (!key) {
      this.allLeagues = this.tempAllLeagues;
      return;
    }
    this.allLeagues = this.tempAllLeagues.filter((league: League) => {
      return league.strLeagueAlternate.toLowerCase().includes(key.toLowerCase())
    });
  }

  getTeams(league: League): void {
    this.teamService.setSelectedLeague(league);
  }

  cancel(): void {
    this.teamService.setSelectedLeague(undefined);
    this.allLeagues = this.tempAllLeagues;
    this.teams = [];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
