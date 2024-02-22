import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { TeamService } from '../../services/team.service';
import { of } from 'rxjs';
import { League } from '../../models/league';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let teamServiceSpy: jasmine.SpyObj<TeamService>;

  const tempAllLeagues: League[] = [
    {
      idLeague: 0,
      strLeague: 'Paris',
      strLeagueAlternate: 'Paris saint germain',
      strSport: 'Soccer'
    },
    {
      idLeague: 1,
      strLeague: 'Arsenal',
      strLeagueAlternate: 'Arsenal Fc',
      strSport: 'Soccer'
    },
    {
      idLeague: 2,
      strLeague: 'Dormund',
      strLeagueAlternate: 'Dormund FC',
      strSport: 'Soccer'
    },
    {
      idLeague: 3,
      strLeague: 'Bayern',
      strLeagueAlternate: 'Bayern FC',
      strSport: 'Soccer'
    },
    {
      idLeague: 4,
      strLeague: 'Man city',
      strLeagueAlternate: 'Man city club',
      strSport: 'Soccer'
    },
  ];

  beforeEach(() => {
    teamServiceSpy = jasmine.createSpyObj('TeamService',
      ['getTeams', 'searchLeagues', 'getSelectedLeague', 'setSelectedLeague']);

    teamServiceSpy.searchLeagues.and.returnValue(of({ leagues: [] }));
    teamServiceSpy.getSelectedLeague.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: TeamService, useValue: teamServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Cancel method', () => {
    it('should empty teams and set selectedLeague to undefined', () => {
      // When
      component.cancel();

      // Then
      expect(component.teams).toEqual([]);
      expect(teamServiceSpy.setSelectedLeague).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getTeams method', () => {
    it('should set selectedLeague with incomming league', () => {
      // Given
      const league: League = {
        idLeague: 0,
        strLeague: 'Arsenal',
        strLeagueAlternate: 'Arsenal FC',
        strSport: 'Soccer'
      }

      // When
      component.getTeams(league);

      // Then
      expect(teamServiceSpy.setSelectedLeague).toHaveBeenCalledWith(league);
    });
  });

  describe('getAllLeagues method', () => {
    it('should retreive all leagues and filter on soccer sport', () => {
      // Given
      const leagues: League[] = [
        {
          idLeague: 0,
          strLeague: 'Arsenal',
          strLeagueAlternate: 'Arsenal FC',
          strSport: 'Soccer'
        },
        {
          idLeague: 0,
          strLeague: 'fdj',
          strLeagueAlternate: 'fdj test',
          strSport: 'Control'
        }
      ];

      teamServiceSpy.searchLeagues.and.returnValue(of({ leagues }));

      // When
      component.getAllLeagues();

      // Then
      expect(teamServiceSpy.searchLeagues).toHaveBeenCalled();
      expect(component.allLeagues).toEqual([leagues[0]]);
    });
  });

  describe('Search method', () => {
    [
      {
        given: {
          key: 'senal'
        },
        then: {
          leagues: [tempAllLeagues[1]]
        }
      },
      {
        given: {
          key: 'paris'
        },
        then: {
          leagues: [tempAllLeagues[0]]
        }
      },
      {
        given: {
          key: ''
        },
        then: {
          leagues: tempAllLeagues
        }
      }
    ].forEach(senario => {
      it('should return list of league who include the key word', () => {
        // Given
        component.tempAllLeagues = tempAllLeagues;

        // When
        component.search(senario.given.key);
  
        // Then
        expect(component.allLeagues).toEqual(senario.then.leagues);
      });
    });
  });
});
