import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from '@angular/common';
import {NavItemsComponent} from '../nav-items/nav-items.component';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [
    NgOptimizedImage,
    NavItemsComponent,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentUrl: string = '';

  isOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUrl = this.router.url;

    // Sottoscrive agli eventi di navigazione (hash oltre che path)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Quando la navigazione è terminata, aggiorna currentUrl
        this.currentUrl = event.urlAfterRedirects.substring(1);
      }
    });
  }

  setIsOpen() {
    this.isOpen = !this.isOpen;
  }

  protected readonly screen = screen;
}
