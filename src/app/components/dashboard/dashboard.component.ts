import { Component, OnInit, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { DataService } from '../../services/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      
      <aside class="sidebar-dock">
        <div class="sidebar-top">
          <div class="logo-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 28px; height: 28px; color: #818cf8;">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="12 8 12 12 14 14"/>
            </svg>
          </div>
          <nav class="nav-links">
            <div class="nav-item" [class.active]="currentTab === 'dashboard'" (click)="switchTab('dashboard')">
              <span class="nav-icon">📊</span> <span class="nav-label">Main Dashboard</span>
            </div>
            <div class="nav-item" [class.active]="currentTab === 'records'" (click)="switchTab('records')">
              <span class="nav-icon">🗂️</span> <span class="nav-label">Registrant Records</span>
            </div>
            <div class="nav-item" [class.active]="currentTab === 'overview'" (click)="switchTab('overview')">
              <span class="nav-icon">🛡️</span> <span class="nav-label">Admin Panel</span>
            </div>
            <div class="nav-item" [class.active]="currentTab === 'profiles'" (click)="switchTab('profiles')">
              <span class="nav-icon">👥</span> <span class="nav-label">Register Beneficiary</span>
            </div>
            <div class="nav-item" [class.active]="currentTab === 'schedules'" (click)="switchTab('schedules')">
              <span class="nav-icon">📅</span> <span class="nav-label">Schedules</span>
            </div>
            <div class="nav-item" [class.active]="currentTab === 'account'" (click)="switchTab('account')">
              <span class="nav-icon">🔑</span> <span class="nav-label">Account Manager</span>
            </div>
            <div class="nav-item" [class.about]="currentTab === 'about'" (click)="switchTab('about')">
              <span class="nav-icon">ℹ️</span> <span class="nav-label">About System</span>
            </div>
          </nav>
        </div>

        <div class="sidebar-bottom">
          <div class="nav-item logout-btn" (click)="handleLogout()">
            <span class="nav-icon">🚪</span> <span class="nav-label">Logout</span>
          </div>
        </div>
      </aside>

      <main class="main-workspace">
        
        <header class="workspace-header">
          <div>
            <span class="sub-title">Administrative Domain</span>
            <h1 class="main-title">
              <ng-container [ngSwitch]="currentTab">
                <span *ngSwitchCase="'dashboard'">Main System Dashboard</span>
                <span *ngSwitchCase="'records'">🗂️ Master Registrant Records</span>
                <span *ngSwitchCase="'overview'">🛡️ Admin Control Panel</span>
                <span *ngSwitchCase="'profiles'">👥 Registry & Detailed Onboarding</span>
                <span *ngSwitchCase="'schedules'">📅 Distribution Timelines</span>
                <span *ngSwitchCase="'account'">👤 Staff Profile Manager</span>
                <span *ngSwitchCase="'about'">⚙️ About System Specs</span>
              </ng-container>
            </h1>
          </div>
          
          <div class="header-actions">
            <div class="notification-bell-wrapper" (click)="toggleNotifications()">
              <span class="bell-icon">🔔</span>
              <span class="bell-badge" *ngIf="unreadNotificationsCount > 0">
                {{ unreadNotificationsCount }}
              </span>
              
              <div class="notifications-dropdown" *ngIf="showNotificationsDropdown" (click)="$event.stopPropagation()">
                <div class="dropdown-header">System Notifications</div>
                <div class="dropdown-body">
                  <p class="empty-dropdown-text">No new broadcast notifications flagged.</p>
                </div>
              </div>
            </div>

            <div class="status-badge">
              <span class="pulse-dot"></span>
              <span class="status-text">Database Sync Active</span>
            </div>
            
            <button (click)="toggleTheme()" class="utility-btn" title="Toggle System Theme">
              {{ isDark ? '☀️' : '🌙' }}
            </button>
          </div>
        </header>

        <div *ngIf="currentTab === 'dashboard'" class="tab-content-wrapper">
          <section class="stats-grid">
            <div class="stat-card modern-gradient">
              <span class="stat-label">Network Guard Security</span>
              <span class="stat-value text-indigo">Operational</span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Total Profile Directory</span>
              <span class="stat-value">{{ (residents$ | async)?.length || 0 }} <span class="stat-unit">records</span></span>
            </div>
            <div class="stat-card">
              <span class="stat-label">Logged Database Transactions</span>
              <span class="stat-value">{{ (logs$ | async)?.length || 0 }} <span class="stat-unit">entries</span></span>
            </div>
          </section>

          <section class="bento-card unified-full-card analytics-chart-card">
            <h3 class="card-title">Live Registration Distribution Metric</h3>
            <p class="chart-subtitle">Calculated distribution analytics measuring Senior Citizen and PWD profile weights inside the cluster node.</p>
            
            <div class="chart-container-box" *ngIf="residents$ | async as completeList">
              <ng-container *ngIf="{
                seniors: countClass(completeList, 'Senior Citizen'),
                pwds: countClass(completeList, 'PWD'),
                totalSubset: countClass(completeList, 'Senior Citizen') + countClass(completeList, 'PWD')
              } as metrics">
                
                <div class="chart-row">
                  <div class="chart-label-block">👵 Senior Citizens ({{ metrics.seniors }})</div>
                  <div class="chart-bar-wrapper">
                    <div class="chart-bar bar-senior" [style.width.%]="getPercent(metrics.seniors, metrics.totalSubset)">
                      <span class="bar-percentage">{{ getPercent(metrics.seniors, metrics.totalSubset) }}%</span>
                    </div>
                  </div>
                </div>

                <div class="chart-row">
                  <div class="chart-label-block">♿ PWD Constituents ({{ metrics.pwds }})</div>
                  <div class="chart-bar-wrapper">
                    <div class="chart-bar bar-pwd" [style.width.%]="getPercent(metrics.pwds, metrics.totalSubset)">
                      <span class="bar-percentage">{{ getPercent(metrics.pwds, metrics.totalSubset) }}%</span>
                    </div>
                  </div>
                </div>

                <p class="chart-empty-notice" *ngIf="metrics.totalSubset === 0">
                  ⚠️ Core telemetry registry reports 0 active entries marked under Senior Citizen or PWD classifications.
                </p>
              </ng-container>
            </div>
          </section>

          <div class="bento-grid">
            <section class="bento-card form-panel">
              <h3 class="card-title">Dispatch Assistance Funds</h3>
              <div class="form-group">
                <div class="input-field-wrapper">
                  <label class="field-label">Select Beneficiary Profile</label>
                  <select [(ngModel)]="selRes" class="system-input">
                    <option value="">Choose a profile...</option>
                    <option *ngFor="let r of residents$ | async" [value]="r.id">
                      {{ r.fullName }} — ({{ getAssistanceLabel(r.tier) }})
                    </option>
                  </select>
                </div>
                <div class="input-field-wrapper">
                  <label class="field-label">Remittance Channel</label>
                  <select [(ngModel)]="method" class="system-input">
                    <option value="Bank Transfer">Direct Bank Remittance</option>
                    <option value="Digital Wallet">Digital Wallet (GCash/Maya)</option>
                    <option value="Cash Dispense">Cash Disbursement Ledger</option>
                  </select>
                </div>
                <div class="input-field-wrapper">
                  <label class="field-label">Allocation Amount (PHP)</label>
                  <div class="input-action-row">
                    <input type="number" [(ngModel)]="amt" placeholder="0.00" class="system-input amt-input">
                    <button (click)="execute()" class="action-btn">Execute Send</button>
                  </div>
                </div>
              </div>
            </section>  

<section class="bento-card unified-full-card">
  <h3 class="card-title">📜 Transaction Log</h3>
  <p class="chart-subtitle">Real-time narrative audit of financial transaction executions.</p>
  
  <div class="ledger-list" *ngIf="logs$ | async as logList">
    <div *ngFor="let l of sortLatestFirst(logList)" class="log-item">

      <div class="ledger-details">
        <span class="ledger-name">👤 {{ l.residentName || 'Unknown Beneficiary' }}</span>
        <span class="ledger-narrative-text">
          ⚡ Transmitted <strong class="highlight-text">₱{{ l.amount || 0 }}</strong> via {{ l.method || 'System Transfer' }}
        </span>
        <span class="ledger-staff">Authorized Node Operator: <strong>{{ l.staff || 'Sys_Admin_Alpha' }}</strong></span>
      </div>
      
      <div class="ledger-meta">
        <span class="ledger-badge-status">SUCCESS</span>
        <span class="ledger-time">{{ (l.timestamp?.seconds * 1000) | date:'shortTime' }}</span>
      </div>
      
    </div>
  </div>
</section>

</div>
</div>

        <div *ngIf="currentTab === 'records'" class="tab-content-wrapper">
          <section class="bento-card unified-full-card">
            <h3 class="card-title">🗂️ Core Registrant Database Master Ledger</h3>
            <p class="chart-subtitle">Historical view tracking complete demographic profiles, geographic metadata, and total distributed subsidies.</p>
            
            <div class="records-table-wrapper">
              <table class="records-table">
                <thead>
                  <tr>
                    <th>Legal Full Name / ID</th>
                    <th>Demographics</th>
                    <th>Socio-Economic</th>
                    <th>Geographic Address</th>
                    <th>Assistance Track / Payout</th>
                  </tr>
                </thead>
                <div style="margin-bottom: 16px; width: 100%;">
                 <input type="text" [(ngModel)]="searchQuery" placeholder="🔍 Search profiles by name or ID..." class="system-input" style="width: 600%; padding: 10px; border-radius: 6px;">
                </div>
                <tbody *ngIf="residents$ | async as residentsList">
                  <tr *ngFor="let r of filterResidents(sortLatestFirst(residentsList))">
                    <td class="record-name-cell">
                      <span class="table-primary-text">👤 {{ r.fullName }}</span>
                      <code class="table-sub-code">ID: {{ r.id }}</code>
                    </td>
                    <td>
                      <div class="compact-cell-stack">
                        <span> DOB: {{ r.birthDate || 'N/A' }}</span>
                        <span> {{ r.gender || 'N/A' }} |  {{ r.civilStatus || 'N/A' }}</span>
                        <span>{{ r.contact || 'N/A' }}</span>
                      </div>  
                    </td>
                    <td>
                      <div class="compact-cell-stack">
                        <span class="badge-sub-info">Class: {{ r.classification || 'Standard' }}</span>
                        <span class="income-text">Income: ₱{{ r.monthlyIncome || '0' }}/mo</span>
                      </div>
                    </td>
                    <td>
                      <div class="compact-cell-stack address-cell">
                        <span>Brgy. {{ r.barangay || 'N/A' }}, {{ r.municipality || 'N/A' }}</span>
                        <span class="sub-address">{{ r.province || 'N/A' }}, {{ r.region || 'N/A' }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="compact-cell-stack">
                        <span class="assistance-tag" [class.tag-t1]="r.tier === 'Tier 1'" [class.tag-t2]="r.tier !== 'Tier 1'">
                          {{ getAssistanceLabel(r.tier) }}
                        </span>
                        <span class="record-payout-cell">₱{{ r.totalFundsReceived || 0 }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="residentsList.length === 0">
                    <td colspan="5" class="table-empty-notice">No registered records found inside the primary node cluster database.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div *ngIf="currentTab === 'overview'" class="tab-content-wrapper">
          <section class="bento-card unified-full-card">
            <h3 class="card-title">🔑 System Account Management Settings</h3>
            <p class="chart-subtitle">Root Admin tool to manage internal staff access and administrative authority profiles.</p>
            
            <div class="account-settings-grid">
              <div class="settings-list-box">
                <div *ngFor="let user of systemAccounts" class="account-manage-item">
                  <div class="account-meta-info">
                    <span class="account-user-title">{{ user.username }}</span>
                    <span class="account-user-badge" [class.badge-admin]="user.role === 'Admin'">{{ user.role }}</span>
                  </div>
                  <div class="account-action-triggers">
                    <button class="settings-inline-btn edit-btn" (click)="manageAccountAction(user, 'Edit')">Modify</button>
                    <button class="settings-inline-btn delete-btn" [disabled]="user.username === 'Sys_Admin_Alpha'" (click)="manageAccountAction(user, 'Revoke')">Revoke</button>
                  </div>
                </div>
              </div>

              <div class="fast-provision-box">
                <span class="field-label">Provision New Internal Account</span>
                <div class="provision-form-row">
                  <input type="text" placeholder="Username / ID" class="system-input tight-input" [(ngModel)]="newAccountName">
                  <select class="system-input tight-input" [(ngModel)]="newAccountRole">
                    <option value="Staff">Staff Role Access</option>
                    <option value="Admin">Admin Root Authority</option>
                  </select>
                  <button class="action-btn tight-btn" (click)="provisionAccount()">Add Account</button>
                </div>
              </div>
            </div>
          </section>

          <section class="bento-card broadcast-panel unified-full-card">
            <h3 class="card-title">System Announcement Broadcaster</h3>
            <div class="form-group">
              <div class="input-field-wrapper">
                <label class="field-label">Broadcast Channel Group</label>
                <select [(ngModel)]="announcementScope" class="system-input">
                  <option value="All">All Registered Constituents</option>
                  <option value="Staff">Internal Node Staff Personnel</option>
                </select>
              </div>
              <div class="input-field-wrapper">
                <label class="field-label">Message Payload</label>
                <textarea [(ngModel)]="announcementText" placeholder="Type global broadcast notification alerts here..." class="system-input text-area-input" rows="3"></textarea>
              </div>
              <button (click)="submitAnnouncement()" class="action-btn wide-btn">Transmit Broadcast</button>
            </div>
          </section>
        </div>

        <div *ngIf="currentTab === 'profiles'" class="tab-content-wrapper">
          <section class="bento-card unified-full-card">
            <h3 class="card-title">📋 Secure Onboarding: Broad-Spectrum Beneficiary Enrollment</h3>
            <p class="chart-subtitle">Please populate all structural data sectors below to register the profile entry into the database cloud network node.</p>
            
            <div class="form-layout-scaffolding">
              
              <div class="form-sector-card">
                <span class="sector-badge">Sector 01</span>
                <h4 class="sector-title">Personal Identity Core</h4>
                <div class="form-grid-2x2">
                  <div class="input-field-wrapper">
                    <label class="field-label">Legal Full Name</label>
                    <input type="text" [(ngModel)]="newProfile.fullName" placeholder="e.g., Juan Dela Cruz" class="system-input">
                  </div>
                  <div class="input-field-wrapper">
                    <label class="field-label">Primary Mobile Link</label>
                    <input type="text" [(ngModel)]="newProfile.contact" placeholder="e.g., 0917XXXXXXX" class="system-input">
                  </div>
                  <div class="input-field-wrapper">
                    <label class="field-label">Date of Birth</label>
                    <input type="date" [(ngModel)]="newProfile.birthDate" class="system-input">
                  </div>
                  <div class="form-grid-inner-split">
                    <div class="input-field-wrapper">
                      <label class="field-label">Gender</label>
                      <select [(ngModel)]="newProfile.gender" class="system-input">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div class="input-field-wrapper">
                      <label class="field-label">Civil Status</label>
                      <select [(ngModel)]="newProfile.civilStatus" class="system-input">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-sector-card">
                <span class="sector-badge">Sector 02</span>
                <h4 class="sector-title">Socio-Economic Profiles</h4>
                <div class="form-grid-2x2">
                  <div class="input-field-wrapper">
                    <label class="field-label">Constituent Demography Classification</label>
                    <select [(ngModel)]="newProfile.classification" class="system-input">
                      <option value="Standard Resident">Standard Household Resident</option>
                      <option value="Senior Citizen">Senior Citizen (60+ Profile)</option>
                      <option value="PWD">Person With Disability (PWD)</option>
                      <option value="Solo Parent">Solo Parent Household</option>
                      <option value="Indigent">Indigent / Low-Income Status</option>
                    </select>
                  </div>
                  <div class="input-field-wrapper">
                    <label class="field-label">Estimated Household Income (Monthly PHP)</label>
                    <input type="number" [(ngModel)]="newProfile.monthlyIncome" placeholder="0.00" class="system-input">
                  </div>
                  <div class="input-field-wrapper lg-span-2">
                    <label class="field-label">Assistance Track Program Route</label>
                    <select [(ngModel)]="newProfile.tier" class="system-input">
                      <option value="Tier 1">Tier 1 — Financial Subsidy Plan</option>
                      <option value="Tier 2">Tier 2 — Medical Care Support</option>
                      <option value="Tier 3">Tier 3 — Social Pension Support</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="form-sector-card">
                <span class="sector-badge">Sector 03</span>
                <h4 class="sector-title">Geographic Address Mapping</h4>
                <div class="form-grid-4x4">
                  <div class="input-field-wrapper">
                    <label class="field-label">Region</label>
                    <input type="text" [(ngModel)]="newProfile.region" placeholder="e.g., Region X" class="system-input">
                  </div>
                  <div class="input-field-wrapper">
                    <label class="field-label">Province</label>
                    <input type="text" [(ngModel)]="newProfile.province" placeholder="e.g., Misamis Oriental" class="system-input">
                  </div>
                  <div class="input-field-wrapper">
                    <label class="field-label">Municipality / City</label>
                    <input type="text" [(ngModel)]="newProfile.municipality" placeholder="e.g., Cagayan de Oro" class="system-input">
                  </div>
                  <div class="input-field-wrapper">
                    <label class="field-label">Barangay Address</label>
                    <input type="text" [(ngModel)]="newProfile.barangay" placeholder="e.g., Barangay 24" class="system-input">
                  </div>
                </div>
              </div>

            </div>

            <div class="form-submission-anchor-dock">
              <button (click)="registerBeneficiary()" class="action-btn execution-onboard-btn">Commit Registration and Build Core Profile</button>
            </div>
          </section>
        </div>

        <div *ngIf="currentTab === 'schedules'" class="tab-content-wrapper">
          <section class="bento-card unified-full-card">
            <div class="section-title-row">
              <h3 class="card-title">📅 Interactive Distribution Schedules</h3>
              <button class="settings-inline-btn edit-btn" (click)="addBlankSchedule()">+ Add Event</button>
            </div>
            
            <div class="custom-table-container editable-schedule-list">
  <div *ngFor="let sch of systemSchedules; let idx = index" class="table-row-item editable-row">
    <div class="editable-schedule-inputs-group">
      <div class="input-field-wrapper">
        <label class="field-label">Event Name</label>
        <input type="text" [(ngModel)]="sch.title" class="system-input tight-input">
      </div>
      <div class="input-field-wrapper">
        <label class="field-label">Dispatch Location</label>
        <input type="text" [(ngModel)]="sch.location" class="system-input tight-input">
      </div>
      <div class="input-field-wrapper">
        <label class="field-label">Timeline</label>
        <input type="text" [(ngModel)]="sch.date" class="system-input tight-input">
      </div>
    </div>
    <button class="settings-inline-btn delete-btn" (click)="removeSchedule(idx)">Remove</button>
  </div>
</div>
          </section>
        </div>

        <div *ngIf="currentTab === 'account'" class="tab-content-wrapper">
          <div class="bento-grid">
            <section class="bento-card form-panel">
              <h3 class="card-title">👥 Node Operator Directory</h3>
              <div class="ledger-list">
                <div *ngFor="let staff of detailedStaffProfiles" 
                     class="table-row-item selectable-item"
                     [class.selected-staff]="selectedStaffIndex === detailedStaffProfiles.indexOf(staff)"
                     (click)="selectStaff(detailedStaffProfiles.indexOf(staff))">
                  <div class="row-main">
                    <span class="row-title">{{ staff.fullName }}</span>
                    <span class="row-subtitle">ID: {{ staff.username }} | {{ staff.clearance }}</span>
                  </div>
                  <span class="row-badge staff-node-badge">{{ staff.assignedNode }}</span>
                </div>
              </div>
            </section>

            <section class="bento-card broadcast-panel">
              <h3 class="card-title">✏️ Live Profile Modification Core</h3>
              <div class="form-group" *ngIf="selectedStaffIndex !== null; else noSelectionTemplate">
                <div class="input-field-wrapper">
                  <label class="field-label">Legal Identity Full Name</label>
                  <input type="text" [(ngModel)]="detailedStaffProfiles[selectedStaffIndex].fullName" class="system-input">
                </div>
                <div class="input-field-wrapper">
                  <label class="field-label">System Operations Username</label>
                  <input type="text" [(ngModel)]="detailedStaffProfiles[selectedStaffIndex].username" class="system-input" readonly>
                </div>
                <div class="input-field-wrapper">
                  <label class="field-label">Assigned Distribution Terminal Hub Node</label>
                  <input type="text" [(ngModel)]="detailedStaffProfiles[selectedStaffIndex].assignedNode" class="system-input">
                </div>
                <div class="input-field-wrapper">
                  <label class="field-label">Security Clearance Privilege Level</label>
                  <select [(ngModel)]="detailedStaffProfiles[selectedStaffIndex].clearance" class="system-input">
                    <option value="Level 5 Root Authority">Level 5 Root Authority</option>
                    <option value="Level 3 Regional Operator">Level 3 Regional Operator</option>
                    <option value="Level 2 Standard Staff">Level 2 Standard Staff</option>
                  </select>
                </div>
              </div>
              <ng-template #noSelectionTemplate>
                <div class="empty-state-card-wrapper">
                  <p class="empty-state-text">Select a staff identity file from the directory panel to activate live profiling modification fields.</p>
                </div>
              </ng-template>
            </section>
          </div>
        </div>

        <div *ngIf="currentTab === 'about'" class="tab-content-wrapper">
          <section class="bento-card unified-full-card">
            <h3 class="card-title">ℹ️ System Infrastructure Specifications</h3>
            <div class="spec-footer-box">
              <div class="spec-inline-grid">
                <div>export <strong>Framework Architecture:</strong> Angular Standalone UI Layer</div>
                <div><strong>Persistence Layer:</strong> Cloud Firestore Distributed Framework</div>
                <div><strong>Security Baseline:</strong> AES-256-GCM Ledger Triggers</div>
                <div><strong>Active Version Build:</strong> v3.4.1-Stable Production Branch</div>
              </div>
            </div>
          </section>
        </div>

      </main>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; min-height: 100vh; background-color: #050505; color: #f8fafc; font-family: system-ui, sans-serif; }
    .sidebar-dock { width: 240px; min-width: 240px; background-color: #0f0f0f; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; justify-content: space-between; padding: 32px 20px; box-sizing: border-box; }
    
    .logo-box { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; background: transparent !important; }
    
    .nav-links { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 14px; cursor: pointer; border-radius: 14px; transition: all 0.2s; color: #94a3b8; user-select: none; }
    .nav-item:hover, .nav-item.active { background-color: rgba(255,255,255,0.04); color: #818cf8; font-weight: 600; }
    .logout-btn { color: #f87171 !important; }
    .logout-btn:hover { background-color: rgba(239,68,68,0.05) !important; }
    
    .main-workspace { flex: 1; padding: 40px; display: flex; flex-direction: column; gap: 32px; box-sizing: border-box; overflow-y: auto; }
    .workspace-header { display: flex; justify-content: space-between; align-items: center; }
    .sub-title { font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 2px; }
    .main-title { font-size: 32px; font-weight: 900; margin: 4px 0 0 0; }
    
    .header-actions { display: flex; align-items: center; gap: 20px; position: relative; }
    
    .notification-bell-wrapper { position: relative; cursor: pointer; font-size: 22px; padding: 4px; user-select: none; }
    .bell-badge { position: absolute; top: -2px; right: -2px; background-color: #ef4444; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 99px; border: 2px solid #050505; }
    .notifications-dropdown { position: absolute; top: 50px; right: 0; width: 280px; background: #0f0f0f; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); z-index: 100; overflow: hidden; }
    .dropdown-header { padding: 12px 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #6366f1; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.01); }
    .dropdown-body { padding: 20px; text-align: center; }
    .empty-dropdown-text { font-size: 12px; color: #64748b; margin: 0; font-style: italic; }

    .status-badge { display: flex; align-items: center; gap: 8px; background-color: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); padding: 8px 16px; border-radius: 99px; }
    .pulse-dot { width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; }
    .status-text { font-size: 12px; font-weight: 600; color: #34d399; }
    .utility-btn { width: 44px; height: 44px; border-radius: 14px; background-color: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: white; cursor: pointer; }

    .tab-content-wrapper { display: flex; flex-direction: column; gap: 24px; width: 100%; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .stat-card { background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 24px; display: flex; flex-direction: column; gap: 8px; }
    .modern-gradient { background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); }
    .stat-label { font-size: 12px; color: #94a3b8; text-transform: uppercase; }
    .stat-value { font-size: 26px; font-weight: 900; }
    .stat-unit { font-size: 14px; color: #64748b; }

    .chart-subtitle { font-size: 13px; color: #94a3b8; margin-top: -16px; margin-bottom: 24px; }
    .chart-container-box { display: flex; flex-direction: column; gap: 18px; background: rgba(0,0,0,0.2); padding: 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.02); }
    .chart-row { display: flex; align-items: center; gap: 16px; }
    .chart-label-block { width: 180px; font-size: 14px; font-weight: 600; color: #cbd5e1; }
    .chart-bar-wrapper { flex: 1; background-color: rgba(255,255,255,0.03); height: 28px; border-radius: 8px; overflow: hidden; display: flex; align-items: center; }
    .chart-bar { height: 100%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px; border-radius: 8px; box-sizing: border-box; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); min-width: 35px; }
    .bar-senior { background: linear-gradient(90deg, #4f46e5, #6366f1); box-shadow: 0 0 12px rgba(99,102,241,0.2); }
    .bar-pwd { background: linear-gradient(90deg, #06b6d4, #0891b2); box-shadow: 0 0 12px rgba(6,182,212,0.2); }
    .bar-percentage { font-size: 12px; font-weight: bold; color: #ffffff; }
    .chart-empty-notice { text-align: center; color: #64748b; font-size: 13px; font-style: italic; margin: 12px 0 0 0; }

    .records-table-wrapper { width: 100%; overflow-x: auto; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; }
    .records-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
    .records-table th { background: rgba(255,255,255,0.02); color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); letter-spacing: 0.5px; }
    .records-table td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.02); color: #cbd5e1; vertical-align: top; }
    .records-table tbody tr:hover { background: rgba(255,255,255,0.01); }
    .table-primary-text { display: block; font-weight: 600; color: #ffffff; font-size: 14px; margin-bottom: 2px; }
    .table-sub-code { display: block; font-size: 11px; color: #64748b; font-family: monospace; }
    .compact-cell-stack { display: flex; flex-direction: column; gap: 4px; line-height: 1.4; }
    .badge-sub-info { font-size: 11px; font-weight: 700; background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; width: max-content; color: #94a3b8; }
    .income-text { font-size: 12px; color: #cbd5e1; }
    .address-cell { font-size: 12px; }
    .sub-address { color: #64748b; font-size: 11px; }
    .record-payout-cell { color: #10b981 !important; font-weight: 800; font-size: 15px; margin-top: 2px; }
    .table-empty-notice { text-align: center; color: #64748b; padding: 40px !important; font-style: italic; }

    .form-layout-scaffolding { display: flex; flex-direction: column; gap: 24px; }
    .form-sector-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 16px; padding: 24px; position: relative; }
    .sector-badge { position: absolute; top: 20px; right: 24px; font-size: 10px; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; background: rgba(99,102,241,0.1); padding: 4px 10px; border-radius: 6px; }
    .sector-title { margin: 0 0 20px 0; font-size: 15px; font-weight: 700; color: #ffffff; border-left: 3px solid #4f46e5; padding-left: 10px; }
    .form-grid-2x2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .form-grid-4x4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .form-grid-inner-split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: flex-end; }
    .lg-span-2 { grid-column: span 2; }
    .form-submission-anchor-dock { display: flex; justify-content: flex-end; margin-top: 12px; }
    .execution-onboard-btn { min-width: 320px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3); }

    .account-settings-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); padding: 20px; border-radius: 16px; }
    .settings-list-box { display: flex; flex-direction: column; gap: 10px; max-height: 180px; overflow-y: auto; }
    .account-manage-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
    .account-meta-info { display: flex; align-items: center; gap: 12px; }
    .account-user-title { font-size: 14px; font-weight: 600; }
    .account-user-badge { font-size: 11px; background: #334155; padding: 2px 8px; border-radius: 4px; font-weight: 700; color: #cbd5e1; }
    .badge-admin { background: #1e1b4b !important; color: #818cf8 !important; border: 1px solid rgba(99,102,241,0.2); }
    .account-action-triggers { display: flex; gap: 8px; }
    .settings-inline-btn { border: none; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .edit-btn { background: rgba(79, 70, 229, 0.2); color: #818cf8; }
    .edit-btn:hover { background: #4f46e5; color: white; }
    .delete-btn { background: rgba(239,68,68,0.1); color: #ef4444; }
    .delete-btn:hover:not(:disabled) { background: #ef4444; color: white; }
    .delete-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .fast-provision-box { display: flex; flex-direction: column; gap: 12px; justify-content: center; border-left: 1px solid rgba(255,255,255,0.05); padding-left: 24px; }
    .provision-form-row { display: flex; flex-direction: column; gap: 10px; }
    .tight-input { padding: 12px !important; font-size: 13px !important; }
    .tight-btn { padding: 12px !important; font-size: 13px !important; }
    
    .bento-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; }
    .bento-card { background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; padding: 32px; }
    .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .card-title { font-size: 17px; font-weight: 800; margin-bottom: 24px; margin-top: 0; color: #cbd5e1; }
    .form-group { display: flex; flex-direction: column; gap: 20px; }
    .input-field-wrapper { display: flex; flex-direction: column; gap: 8px; width: 100%; }
    .field-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
    .system-input { width: 100%; background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; color: white; font-size: 14px; outline: none; box-sizing: border-box; }
    .input-action-row { display: flex; gap: 16px; }
    .action-btn { background-color: #4f46e5; color: white; border: none; border-radius: 14px; padding: 16px 24px; font-weight: 700; cursor: pointer; font-size: 14px; }
    .wide-btn { width: 100%; }
    
    .ledger-list { display: flex; flex-direction: column; gap: 12px; max-height: 300px; overflow-y: auto; }
    .ledger-item, .table-row-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 14px; transition: all 0.2s; }
    .selectable-item { cursor: pointer; }
    .selectable-item:hover { background-color: rgba(255,255,255,0.03); border-color: rgba(99,102,241,0.2); }
    .selected-staff { background-color: rgba(79, 70, 229, 0.1) !important; border-color: #4f46e5 !important; }
    .ledger-details, .row-main { display: flex; flex-direction: column; gap: 4px; }
    .ledger-name, .row-title { font-weight: 600; font-size: 14px; }
    .ledger-staff, .balance-label { font-size: 11px; color: #475569; }
    .highlight-text { color: #818cf8; }
    .ledger-meta, .registry-balance-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .ledger-amount, .row-badge { color: #10b981; font-weight: 800; font-size: 15px; }
    .ledger-time { font-size: 10px; color: #475569; }
    
    .assistance-tag { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; width: max-content; margin-top: 2px; text-align: center; display: inline-block; }
    .tag-t1 { background-color: rgba(79, 70, 229, 0.15); color: #818cf8; border: 1px solid rgba(79, 70, 229, 0.2); }
    .tag-t2 { background-color: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.2); }
    .ledger-narrative-text { font-size: 13px; color: #cbd5e1; margin: 2px 0; }
    .ledger-badge-status { background-color: rgba(16, 185, 129, 0.1); color: #34d399; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; }

    .staff-node-badge { background: rgba(255,255,255,0.04); color: #cbd5e1; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }
    .editable-schedule-list { display: flex; flex-direction: column; gap: 16px; max-height: 450px; overflow-y: auto; padding-right: 4px; }
    .editable-row { flex-direction: row; gap: 20px; align-items: flex-end; padding: 20px; background: rgba(255,255,255,0.01); }
    .editable-schedule-inputs-group { display: flex; flex: 1; gap: 16px; }

    .empty-state-card-wrapper { display: flex; align-items: center; justify-content: center; height: 260px; border: 2px dashed rgba(255,255,255,0.05); border-radius: 16px; padding: 24px; text-align: center; }
    .empty-state-text { color: #64748b; font-size: 14px; max-width: 280px; line-height: 1.5; }
    .unified-full-card { background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; padding: 32px; width: 100%; box-sizing: border-box; }
    .custom-table-container { display: flex; flex-direction: column; gap: 12px; }

    /* GLOBAL LIGHT MODE RULES */
    :root:not(.dark) .dashboard-container { background-color: #f8fafc; color: #0f172a; }
    :root:not(.dark) .sidebar-dock { background-color: #ffffff; border-right-color: #e2e8f0; }
    :root:not(.dark) .nav-item:hover, :root:not(.dark) .nav-item.active { background-color: #f1f5f9; color: #4f46e5; }
    :root:not(.dark) .bento-card, :root:not(.dark) .stat-card, :root:not(.dark) .unified-full-card { background-color: #ffffff; border-color: #e2e8f0; }
    :root:not(.dark) .system-input { background-color: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
    :root:not(.dark) .table-row-item, :root:not(.dark) .ledger-item { background-color: #f8fafc; border-color: #e2e8f0; }
    :root:not(.dark) .chart-container-box { background: #f1f5f9; border-color: #cbd5e1; }
    :root:not(.dark) .chart-label-block { color: #334155; }
    :root:not(.dark) .chart-bar-wrapper { background-color: #e2e8f0; }
    :root:not(.dark) .account-manage-item { background: #f8fafc; border-color: #cbd5e1; }
    :root:not(.dark) .fast-provision-box { border-left-color: #cbd5e1; }
    :root:not(.dark) .selected-staff { background-color: rgba(79, 70, 229, 0.05) !important; border-color: #4f46e5 !important; }
    :root:not(.dark) .staff-node-badge { background: #e2e8f0; color: #334155; border-color: #cbd5e1; }
    :root:not(.dark) .editable-row { background: #ffffff; }
    :root:not(.dark) .ledger-narrative-text { color: #334155; }
    
    :root:not(.dark) .records-table-wrapper { background: #ffffff; border-color: #cbd5e1; }
    :root:not(.dark) .records-table th { background: #f1f5f9; border-bottom-color: #cbd5e1; color: #475569; }
    :root:not(.dark) .records-table td { border-bottom-color: #e2e8f0; color: #334155; }
    :root:not(.dark) .table-primary-text { color: #0f172a; }
    :root:not(.dark) .table-sub-code { color: #64748b; }
    :root:not(.dark) .badge-sub-info { background: #e2e8f0; color: #475569; }
    :root:not(.dark) .sub-address { color: #64748b; }

    :root:not(.dark) .form-sector-card { background: #f8fafc; border-color: #cbd5e1; }
    :root:not(.dark) .sector-title { color: #0f172a; }
    
    :root:not(.dark) .bell-badge { border-color: #f8fafc; }
    :root:not(.dark) .notifications-dropdown { background: #ffffff; border-color: #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    :root:not(.dark) .dropdown-header { border-bottom-color: #e2e8f0; background: #f8fafc; }
  `],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  private ds = inject(DataService);
  private router = inject(Router); 
  
  residents$ = this.ds.getResidents();
  logs$ = this.ds.getLogs();

  searchQuery: string = '';
  currentUserRole: string = 'Staff';

  isDark = true;
  currentTab = 'dashboard'; 
  
  showNotificationsDropdown = false;
  unreadNotificationsCount = 2; 

  selRes = '';
  amt = 0;
  method = 'Bank Transfer';

  announcementScope = 'All';
  announcementText = '';
  announcementType = '';
  scheduledTime = '';

  newProfile: any = { 
    fullName: '', contact: '', tier: 'Tier 2', birthDate: '', gender: 'Female',
    civilStatus: 'Single', classification: 'Standard Resident', monthlyIncome: null,
    region: '', province: '', municipality: '', barangay: ''
  };

  systemAccounts = [
    { username: 'Admin_Alpha', role: 'Admin' },
    { username: 'Staff_01', role: 'Staff' },
    { username: 'Staff_02', role: 'Staff' }
  ];
  newAccountName = '';
  newAccountRole = 'Staff';

  systemSchedules: any[] = [];

  detailedStaffProfiles = [
    { fullName: 'Administrator', username: 'Admin_Alpha', assignedNode: 'Regional Office 1', clearance: 'Level 5 Root Authority' },
    { fullName: 'Staff Renier Cute', username: 'Staff_01', assignedNode: 'Brgy Hall', clearance: 'Level 2 Standard Staff' },
    { fullName: 'Staff Renier Hotty', username: 'Staff_02', assignedNode: 'Disbursement Office', clearance: 'Level 3 Regional Operator' }
  ];
  selectedStaffIndex: number | null = 0;

  ngOnInit(): void { this.applyTheme(); }
  
  toggleTheme(): void { this.isDark = !this.isDark; this.applyTheme(); }
  applyTheme(): void { document.documentElement.classList.toggle('dark', this.isDark); }
  switchTab(tabName: string): void { this.currentTab = tabName; }

  toggleNotifications(): void {
    this.showNotificationsDropdown = !this.showNotificationsDropdown;
    if (this.showNotificationsDropdown) {
      this.unreadNotificationsCount = 0; 
    }
  }

  filterResidents(list: any[] | null): any[] {
   if (!list) return [];
   if (!this.searchQuery.trim()) return list;
  const query = this.searchQuery.toLowerCase();
  return list.filter(res => 
    res.fullName?.toLowerCase().includes(query) || 
    res.id?.toLowerCase().includes(query)
  );
  }
  
sortLatestFirst(list: any[] | null): any[] {
  if (!list || list.length === 0) return [];

  // Create a safe copy of the list so we don't freeze the original array
  const copy = [...list];

  // 1. FIRST TRY: Sort by timestamp if it exists
 if (copy[0] && copy[0].timestamp && typeof copy[0].timestamp === 'object' && 'seconds' in copy[0].timestamp) {
    return copy.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
  }

  if (copy[0] && 'createdAt' in copy[0]) {
    return copy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  // 2. SECOND TRY: If IDs are numbers (like 1, 2, 3), sort by highest ID first
  const firstId = copy[0]?.id;
  if (firstId && !isNaN(Number(firstId))) {
    return copy.sort((a, b) => Number(b.id) - Number(a.id));
  }

  // 3. THIRD TRY: If IDs are text strings (like Firebase keys), sort them textually
  if (firstId && typeof firstId === 'string') {
    return copy.sort((a, b) => b.id.localeCompare(a.id));
  }

  // 4. ULTIMATE FALLBACK: Just flip the database order completely
  return copy.reverse();
}

  editProfile(resident: any): void {
    if (!resident) return;
    this.newProfile = { ...resident }; 
    this.currentTab = 'registration'; 
  }

  countClass(list: any[] | null, targetClass: string): number {
    if (!list) return 0;
    return list.filter(item => item.classification === targetClass).length;
  }

  getPercent(count: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }

  getAssistanceLabel(tier: string | undefined): string {
    if (tier === 'Tier 1') return 'Financial Subsidy Plan';
    if (tier === 'Tier 3') return 'Social Pension Support';
    return 'Medical Care Support';
  }

  selectStaff(index: number): void { this.selectedStaffIndex = index; }
  addBlankSchedule(): void {
  this.systemSchedules.unshift({
    title: '',      // Leaves input blank so the HTML placeholder/ghost text works
    location: '',
    date: ''        // Empty string ready for the date-time picker
  });
}
  removeSchedule(index: number): void { this.systemSchedules.splice(index, 1); }

  manageAccountAction(account: any, type: string) {
    if (type === 'Revoke') {
      if (confirm(`Revoke authentication clearance for ${account.username}?`)) {
        this.systemAccounts = this.systemAccounts.filter(a => a.username !== account.username);
        this.detailedStaffProfiles = this.detailedStaffProfiles.filter(p => p.username !== account.username);
        this.selectedStaffIndex = null;
      }
    } else if (type === 'Edit') {
      const targetRole = account.role === 'Admin' ? 'Staff' : 'Admin';
      if (confirm(`Toggle authority profile for ${account.username} to ${targetRole}?`)) {
        account.role = targetRole;
      }
    }
  }

  provisionAccount() {
    if (!this.newAccountName.trim()) return;
    const name = this.newAccountName.trim();
    this.systemAccounts.push({ username: name, role: this.newAccountRole });
    this.detailedStaffProfiles.push({
      fullName: `Operator ${name}`,
      username: name,
      assignedNode: 'Pending Node Assignment',
      clearance: this.newAccountRole === 'Admin' ? 'Level 5 Root Authority' : 'Level 2 Standard Staff'
    });
    this.newAccountName = '';
    alert('System Access Token Provisioned.');
  }

  async execute(): Promise<void> {
    if (!this.selRes || this.amt <= 0) return;
    try {
      await this.ds.releaseFunds(this.selRes, this.amt, 'Admin_Alpha', this.method);
      this.amt = 0; this.selRes = '';
      alert('Secure Asset Transaction Committed to Ledger.');
    } catch (e: any) { alert(`Error: ${e.message}`); }
  }

  async submitAnnouncement(): Promise<void> {
    // 1. Validation check: Ensure they filled out the message and the new event type
    if (!this.announcementText.trim() || !this.announcementType.trim()) {
      alert('Please enter both an Event Type and a Message Payload.');
      return;
    }

    try {
      if (typeof (this.ds as any).addNotification === 'function') {
        // 2. Format the time display if they picked a date, otherwise default to "Immediate"
        const timeDisplay = this.scheduledTime ? ` Scheduled: ${this.scheduledTime}` : ' [Immediate]';
        
        // 3. Construct the clean message string that your notification bell will read
        const formattedMessage = `[Broadcast - ${this.announcementScope}] (${this.announcementType}) ${this.announcementText}${timeDisplay}`;
        
        // 4. Send it directly to your notification bell service
        await (this.ds as any).addNotification(formattedMessage);
      }

      // 5. Clear out all the text inputs so they go back to the ghost text placeholders
      this.announcementText = '';
      this.announcementType = '';
      this.scheduledTime = '';
      
      alert('Broadcast Announcement Transmitted.');
    } catch (e: any) { 
      alert(`Error: ${e.message}`); 
    }
  }

  async registerBeneficiary(): Promise<void> {
  if (!this.newProfile.fullName.trim()) {
    alert('Error: Legal Identity Full Name field cannot be left blank.');
    return;
  }

  // 1. FETCH LATEST RECORDS FOR DUPLICATE CHECKING
  let currentResidents: any[] = [];
  try {
    currentResidents = await new Promise<any[]>((resolve) => {
      const sub = (this.ds as any).getResidents().subscribe((data: any) => {
        resolve(data || []);
        sub.unsubscribe();
      });
    });
  } catch (err) {
    currentResidents = [];
  }

  // 2. SMART DUPLICATE CHECK (Ignores checking the person against themselves if editing)
  const isDuplicate = currentResidents.some((res: any) => 
    res.id !== this.newProfile.id && // 👈 Crucial: Skips matching its own existing record ID
    res.fullName?.toLowerCase().trim() === this.newProfile.fullName.toLowerCase().trim()
  );

  if (isDuplicate) {
    alert('🚨 Registration Blocked: A record with this exact name already exists.');
    return;
  }

  // 3. SMART SAVE (Decides whether to ADD or UPDATE)
  try {
    if (this.newProfile.id) {
      // 📝 OPTION A: If an ID exists, we are UPDATING an old record
      if (typeof (this.ds as any).updateResident === 'function') {
        await (this.ds as any).updateResident(this.newProfile);
      } else if (typeof (this.ds as any).editResident === 'function') {
        await (this.ds as any).editResident(this.newProfile);
      }
      alert('Profile Updated Successfully in Core System Repositories.');

    } else {
      // ➕ OPTION B: If NO ID exists, we are ADDING a brand new record
      if (typeof (this.ds as any).addResident === 'function') {
        const profileWithTimestamp = { 
          ...this.newProfile, 
          createdAt: new Date().getTime() 
        };
        await (this.ds as any).addResident(profileWithTimestamp);
      }
      alert('Profile Enrolled Successfully into Core System Repositories.');
    }

    // Clear the form fields back to empty defaults when done
    this.newProfile = { 
      fullName: '', contact: '', tier: 'Tier 2', birthDate: '', gender: 'Female',
      civilStatus: 'Single', classification: 'Standard Resident', monthlyIncome: null,
      region: '', province: '', municipality: '', barangay: ''
    };
    
  } catch (e: any) { 
    alert(`Error: ${e.message}`); 
  }
}

  handleLogout(): void {
    if (confirm('Terminate session and log out?')) {
      this.router.navigate(['/login']); 
    }
  }
}