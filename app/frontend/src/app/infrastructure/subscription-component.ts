import { OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

export class SubscriptionComponent implements OnDestroy  {

    private subs: Subscription[] = [];
    ngOnDestroy(): void {
        this.subs.forEach(s => {
            s.unsubscribe();
        });
    }
    recordSubscription(s: Subscription) {
        this.subs.push(s);
    }

}
