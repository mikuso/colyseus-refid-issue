import { Room } from "@colyseus/core";
import { schema } from "@colyseus/schema";

const Entity = schema({
    thing: "number"
});

const MyRoomState = schema({
    entities: [ Entity ]
});


export class MyRoom extends Room {
    state = new MyRoomState();

    onCreate(options) {
        // crucial #1: the patch rate must be higher than the frequency of
        // updates to the members of the ArraySchema instance.
        this.patchRate = 420;

        // populate entities array
        this.state.entities = [];

        const repopulateEntitiesArray = (count) => {
            console.log(`Adding ${count} entities`);
            for (let i = 0; i < count; i++) {
                const ent = new Entity();
                ent.thing = i;
                this.state.entities.push(ent);
            }
        };

        repopulateEntitiesArray(100);

        this.setSimulationInterval(() => {
            // crucial #2: changes are made to entities in the array
            this.state.entities.forEach(ent => {
                ent.thing++;
            });

            // crucial #3: an entity is removed from an earlier part of the array
            // (ths removed entity must have a lower index than any of the modified entities)
            this.state.entities.shift();

            // report how many entities are currently in the array
            console.log(`Entity count: ${this.state.entities.length}`);

            if (!this.state.entities.length) {
                repopulateEntitiesArray(100);
            }
        }, 69);
    }
}
