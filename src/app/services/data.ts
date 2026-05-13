import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  increment,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);

  /**
   * 🗺️ GET RESIDENTS
   * Replaced with a native onSnapshot listener to completely kill the _Query error.
   */
  getResidents(): Observable<any[]> {
    return new Observable(observer => {
      const residentsCollection = collection(this.firestore, 'residents');
      
      // Use native firestore streaming listener
      const unsubscribe = onSnapshot(residentsCollection, 
        (snapshot) => {
          const residents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          observer.next(residents);
        },
        (error) => observer.error(error)
      );

      // Clean up the listener automatically when the component unmounts
      return () => unsubscribe();
    });
  }

  /**
   * 📜 GET LOGS
   * Replaced with a native onSnapshot listener for stable tracking.
   */
  getLogs(): Observable<any[]> {
    return new Observable(observer => {
      const logsCollection = collection(this.firestore, 'logs');
      
      const unsubscribe = onSnapshot(logsCollection, 
        (snapshot) => {
          const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          observer.next(logs);
        },
        (error) => observer.error(error)
      );

      return () => unsubscribe();
    });
  }

  /**
   * 📋 ADD RESIDENT
   */
  async addResident(residentData: any): Promise<any> {
    const residentsCollection = collection(this.firestore, 'residents');
    
    const payload = {
      fullName: residentData.fullName || 'Unnamed Registrant',
      contact: residentData.contact || 'N/A',
      tier: residentData.tier || 'Tier 2',
      birthDate: residentData.birthDate || '',
      gender: residentData.gender || 'Female',
      civilStatus: residentData.civilStatus || 'Single',
      classification: residentData.classification || 'Standard Resident',
      monthlyIncome: residentData.monthlyIncome ? Number(residentData.monthlyIncome) : 0,
      region: residentData.region || '',
      province: residentData.province || '',
      municipality: residentData.municipality || '',
      barangay: residentData.barangay || '',
      totalFundsReceived: 0,
      createdAt: new Date()
    };

    return addDoc(residentsCollection, payload);
  }

  /**
   * 💰 RELEASE FUNDS & UPDATE LEDGER
   */
  async releaseFunds(residentId: string, amount: number, staffHandle: string, paymentMethod: string): Promise<void> {
    const logsCollection = collection(this.firestore, 'logs');
    const residentDocRef = doc(this.firestore, `residents/${residentId}`);

    return new Promise((resolve, reject) => {
      const residentsCollection = collection(this.firestore, 'residents');
      
      const unsubscribe = onSnapshot(residentsCollection, 
        async (snapshot) => {
          unsubscribe(); // Disconnect immediately
          
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          const target: any = list.find(r => r.id === residentId);
          
          if (!target) {
            reject(new Error('Target beneficiary profile record missing.'));
            return;
          }

          try {
            await updateDoc(residentDocRef, {
              totalFundsReceived: increment(amount)
            });

            await addDoc(logsCollection, {
              residentId: residentId,
              residentName: target.fullName,
              amount: Number(amount),
              method: paymentMethod,
              staff: staffHandle || 'Admin_Alpha',
              timestamp: new Date()
            });

            resolve();
          } catch (err) {
            reject(err);
          }
        },
        (err) => reject(err)
      );
    });
  }

  /**
   * 📢 ADD GLOBAL NOTIFICATION BROADCAST
   */
  async addNotification(messagePayload: string): Promise<any> {
    const notificationsCollection = collection(this.firestore, 'notifications');
    return addDoc(notificationsCollection, {
      message: messagePayload,
      timestamp: new Date()
    });
  }
}