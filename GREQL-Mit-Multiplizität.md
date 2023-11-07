<checkerrules>

  # Regeln zu Klassen
  
    <rule type="presence" points="4">
		<query>from x : V{Class}, y : V{Property} with x --> y and x.name="Rezept" and isDefined(y.name) and (capitalizeFirst(y.name)="Name" or capitalizeFirst(y.name)="Bezeichnung") report x.name, y.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "Rezept" mit dem Attribut "Name" oder "Bezeichnung".</feedback>
	</rule>

    <rule type="presence" points="5">
		<query>from x : V{Class} with x.name="Schritt" report x.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "Schritt".</feedback>
	</rule>

    <rule type="presence" points="4">
		<query>from x : V{Class}, y : V{Property} with x --> y and x.name="Zutat" and isDefined(y.name) and capitalizeFirst(y.name)="Menge" report x.name, y.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "Rezept" mit dem Attribut "Menge".</feedback>
	</rule>

    <rule type="presence" points="5">
		<query>from x : V{Class} with x.name="Lebensmittel" report x.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "Lebensmittel".</feedback>
	</rule>

    <rule type="presence" points="4">
		<query>from x : V{Class}, y : V{Property} with x --> y and x.name="Anweisung" and isDefined(y.name) and (capitalizeFirst(y.name)="Text" or capitalizeFirst(y.name)="Beschreibung") report x.name, y.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "Anweisung" mit dem Attribut "Text" oder "Beschreibung".</feedback>
	</rule>

    <rule type="presence" points="5">
		<query>from x : V{Class} with x.name="CookMixAnweisung" report x.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "CookMixAnweisung".</feedback>
	</rule>

    <rule type="presence" points="4">
		<query>from x : V{Class}, y : V{Property} with x --> y and (x.name="Schrittzutat" or x.name="SchrittZutat") and isDefined(y.name) and capitalizeFirst(y.name)="Menge" report x.name, y.name end</query>
		<feedback>Das Diagramm enthält keine Klasse "SchrittZutat"/"Schrittzutat" mit dem Attribut "Menge".</feedback>
	</rule>


    <rule type="presence" points="4">
        <query>from x : V{Class}, y : V{Property} with x --> y report x.name end</query>
        <feedback>Jede Klasse muss mindestens 1 Attribut besitzen.</feedback>
    </rule>


# Regeln zu Dingen, die nicht reingehören

    <rule type="absence" points="5">
		<query>from x : V{Class} with x.name="Koch" report x.name end</query>
		<feedback>Der Akteur "Koch" gehört nicht ins Domänenklassendiagramm.</feedback>
	</rule>

	<rule type="absence" points="5">
		<query>from x : V{Class} with x.name="System" report x.name end</query>
		<feedback>Der Akteur "System" gehört nicht ins Domänenklassendiagramm.</feedback>
	</rule>

    <rule type="absence" points="5">
        <query>from x : V{Class}, y : V{Operation} with x --> y report x.name end</query>
        <feedback>Operationen gehören nicht ins Domänenklassendiagramm.</feedback>
    </rule>


# Regeln zu Attribute


   	<rule type="presence" points="5">
        <query>from x,y : V{Class} with isDefined(x.name) and x.name="CookMixAnweisung" and isDefined(y.name) and y.name="Anweisung" and x --> V{Generalization} --> y report 1 end</query>
        <feedback>Das Diagramm sollte eine Oberklasse "Anweisung" besitzen, die von einer "CookMixAnweisung" beerbt wird.</feedback>
    </rule> 

    <rule type="absence" points="4">
		<query>let c := count(from y : V{Property} with isDefined(y.name) report y end) in from x : set(1) with c&lt;7 report c as "count" end</query>
		<feedback>Das Diagramm sollte mindestens 7 Attribute enthalten, enthält aber {count}.</feedback>
	</rule>


# Regeln zu Beziehungen


  	<rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Rezept" and y.name="Schritt" report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einem Rezept und einem Schritt oder keine Klassen mit diesen Namen.</feedback>
	</rule>

    <rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Schritt" and (y.name="Schrittzutat" or y.name="SchrittZutat") report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einem Schritt und einer SchrittZutat/Schrittzutat oder keine Klassen mit diesen Namen.</feedback>
	</rule>

    <rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Lebensmittel" and (y.name="Schrittzutat" or y.name="SchrittZutat") report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einem Lebensmittel und einer SchrittZutat/Schrittzutat oder keine Klassen mit diesen Namen.</feedback>
	</rule>

    <rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Zutat" and (y.name="Schrittzutat" or y.name="SchrittZutat") report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einer Zutat und einer SchrittZutat/Schrittzutat oder keine Klassen mit diesen Namen.</feedback>
	</rule>

    <rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Rezept" and y.name="Zutat" report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einem Rezept und einer Zutat oder keine Klassen mit diesen Namen.</feedback>
	</rule>

    <rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Lebensmittel" and y.name="Zutat" report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einem Lebensmittel und einer Zutat oder keine Klassen mit diesen Namen.</feedback>
	</rule>

    <rule type="presence" points="11">
		<query>from x,y : V{Class} with x &lt;-- V{Property} &lt;-- V{Association} --> V{Property} --> y and x.name="Anweisung" and y.name="Schritt" report x.name as "start", y.name as "end" end</query>
		<feedback>Das Diagramm enthält keine Beziehung zwischen einer Anweisung und einem Schritt oder keine Klassen mit diesen Namen.</feedback>
	</rule>


# Regeln zu Komposition und Aggregation

    <rule type="presence" points="8">
		<query>from x, y: V{Class}, p: V{Property} with x.name = "Rezept" and y.name = "Schritt" and x --> p and p.name=lowerCase(y.name) and isDefined(p.aggregation) and p.aggregation="composite" report 1 end</query>
		<feedback>Die Beziehung zwischen "Rezept" und "Schritt" sollte eine Komposition sein.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, p: V{Property} with x.name = "Rezept" and y.name = "Zutat" and x --> p and p.name=lowerCase(y.name) and isDefined(p.aggregation) and p.aggregation="composite" report 1 end</query>
		<feedback>Die Beziehung zwischen "Rezept" und "Zutat" sollte eine Komposition sein.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, p: V{Property} with x.name = "Schritt" and (y.name = "Schrittzutat" or y.name = "SchrittZutat") and x --> p and p.name=lowerCase(y.name) and isDefined(p.aggregation) and p.aggregation="composite" report 1 end</query>
		<feedback>Die Beziehung zwischen "Schritt" und "SchrittZutat/Schrittzutat" sollte eine Komposition sein.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, p: V{Property} with x.name = "Lebensmittel" and (y.name = "Schrittzutat" or y.name = "SchrittZutat") and x --> p and p.name=lowerCase(y.name) and isDefined(p.aggregation) and p.aggregation="composite" report 1 end</query>
		<feedback>Die Beziehung zwischen "Lebensmittel" und "SchrittZutat/Schrittzutat" sollte eine Komposition sein.</feedback>
	</rule>


# Multiplizitätsregeln

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Rezept" and y.name = "Schritt" and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "1..*") report 1 end</query>
		<feedback>Ein Rezept sollte mindestens einen Schritt haben.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Schritt" and y.name = "Anweisung" and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "1..*") report 1 end</query>
		<feedback>Ein Schritt sollte mindestens eine Anweisung haben.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Rezept" and y.name = "Zutat" and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "1..*") report 1 end</query>
		<feedback>Ein Rezept sollte mindestens eine Zutat haben.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Zutat" and (y.name = "SchrittZutat" or y.name="Schrittzutat") and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "1..*") report 1 end</query>
		<feedback>Eine Zutat sollte mindestens eine SchrittZutat/Schrittzutat haben.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Schritt" and (y.name = "SchrittZutat" or y.name="Schrittzutat") and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "*") report 1 end</query>
		<feedback>Ein Schritt sollte beliebig viele Instanzen von "SchrittZutat/Schrittzutat" haben.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Lebensmittel" and (y.name = "SchrittZutat" or y.name="Schrittzutat") and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "*") report 1 end</query>
		<feedback>Ein Lebensmittel sollte beliebig viele Instanzen von "SchrittZutat/Schrittzutat" haben.</feedback>
	</rule>

	<rule type="presence" points="8">
		<query>from x, y: V{Class}, z: V{Property} with x.name ="Zutat" and y.name = "Lebensmittel" and (x --> z -->{TypeEdge} y) and not isEmpty(z -->&amp;{Association}) and checkMultiplicity(z, "1") report 1 end</query>
		<feedback>Beliebig viele Instanzen von "Zutat" sollten ein Lebensmittel haben.</feedback>
	</rule>


# Konsistenzregel

	<rule type="absence" points="0">
		<query>from x,y : V{Property} with isDefined(x.name) and isDefined(y.name) and x.name=capitalizeFirst(x.name) and not (y.name=capitalizeFirst(y.name)) report x.name, y.name end</query>
		<feedback>Hinweis (ohne Punktabzug): Ein Diagramm sollte eine konsistente Schreibweise enthalten, in der entweder alle Attribute mit einem Großbuchstaben oder alle Attribute mit einem Kleinbuchstaben beginnen.</feedback>
	</rule>
</checkerrules>
