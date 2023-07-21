import {defineStore} from "pinia";
import type { UmlModel } from "@/@types/model";
import { analyze } from "@/uml-handler/analyzer";


export const useMainStore = defineStore("main", {
    state: () => ({
        model: null as UmlModel | null,
    }),
    actions: {
        parseModel(umlModelTag: ParentNode) {
            this.model = analyze(umlModelTag);
        },
    }
});