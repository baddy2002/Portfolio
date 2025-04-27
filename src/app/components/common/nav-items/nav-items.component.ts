import { Component } from '@angular/core';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {navItems} from '../../../managements/constants';

@Component({
  selector: 'app-nav-items',
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './nav-items.component.html',
  styleUrl: './nav-items.component.css'
})
export class NavItemsComponent {

  protected readonly navItems = navItems;
}
