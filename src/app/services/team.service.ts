import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { League } from '../models/league';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  private selectedLeague = new BehaviorSubject<League | undefined>(undefined);

  public setSelectedLeague(league: League | undefined): void {
    this.selectedLeague.next(league);
  }

  public getSelectedLeague(): Observable<League | undefined> {
    return this.selectedLeague.asObservable();
  }

  searchLeagues(): Observable<any> {
    return this.http.get<any>('https://www.thesportsdb.com/api/v1/json/3/all_leagues.php');
  }

  getTeams(league: string): Observable<any> {
    return this.http.get<any>('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=' + league);
  }

  getTeamDetail(team: string): Observable<any> {
    // Always return Arsenal team (bug)
    return this.http.get<any>('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=' + team);
  }
}
