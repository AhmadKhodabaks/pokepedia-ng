import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { CatchService } from 'src/app/services/catch.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-catch-button',
  templateUrl: './catch-button.component.html',
  styleUrls: ['./catch-button.component.css']
})
export class CatchButtonComponent implements OnInit {

  public isCaught: boolean = false;
  public loading: boolean = false;

  @Input() pokemonId: number = -1;

  constructor(private readonly catchService: CatchService, private userService: UserService) {}

  ngOnInit(): void {
    this.isCaught = this.userService.isCaught(this.pokemonId);
  }

  onCatchClick(): void {
    this.loading = true;
    this.catchService.addToCaught(this.pokemonId)
    .subscribe({
      next: (user: User) => {
        this.loading = false;
        this.isCaught = this.userService.isCaught(this.pokemonId);        
      },
      error: (error: HttpErrorResponse) => {
        console.log("ERROR", error.message);
        
      }
    })
  }

}
