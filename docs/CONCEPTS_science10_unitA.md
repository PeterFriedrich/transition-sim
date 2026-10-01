<!-- Supplied by the owner on 2026-10-01 as "the other list". Verbatim below this comment:
     fix a mistake only on the owner's say-so. Sims cite concepts by their IDs (e.g. 2.5). -->

# Science 10, Unit A: Energy and Matter in Chemical Change
Concept list for sim/viz build. Each concept has: core facts, data to encode, and a viz/sim hook.

Scope note: topics come from the general Alberta Science 10 program, not a specific school outline. Sections 1-3 were reviewed in detail. Sections 4-7 are outlined only.
Out of scope until Chem 20: moles/stoichiometry, orbitals (s/p/d/f), electron configurations, transition-metal shell filling.

---

## 0. Cross-cutting ideas

### 0.1 Why reactions happen (the basket)
1. Lower energy: products more stable than reactants (bonds formed stronger than bonds broken)
2. Full outer shells: reached by transferring (ionic) or sharing (covalent) electrons
3. Electron pull: the atom holding electrons more tightly takes them; more reactive metal displaces less reactive
4. Opposite charges attract: ions stick together; polar water stabilizes ions
5. More disorder (entropy): gases released, solids dissolving, one big molecule becoming many small ones
6. Something leaves the mixture: gas bubbles off, precipitate forms, water forms (drives double replacement)
7. A way to get started: heat, spark, light, catalyst, surface, dissolving (affects speed, not whether it is favourable)
- Note: favourable is not the same as fast. Activation energy is the barrier (H2 + O2 waits for a spark).
- Viz hook: energy-profile diagram (reactants, barrier, products) with sliders for barrier height and product energy; show "favourable but slow" vs "favourable and fast".

### 0.2 What "elemental" means in everyday life
- Single free atoms: essentially only noble gases (He, Ne, Ar; Ar is about 1% of air)
- Elements as molecules: O2, N2 (about 99% of air together), H2, Cl2
- Elements as bulk solids: Cu wire, Al foil, Fe nail, diamond and graphite (C), S
- Everything else is compounds, many ionic: crust is mostly silicates/oxides, ocean is water plus Na+/Cl-/Mg2+, body fluids carry Na+, K+, Ca2+, Cl-
- Refined metals drift back toward ions (iron rusts, silver tarnishes, copper turns green). Aluminum is abundant only as oxide; extraction needs large electrical energy.
- Viz hook: pie/treemap of crust, ocean and air composition by form (free atom / molecule / ionic compound / covalent compound).

---

## 1. Atomic structure

### 1.1 Subatomic particles
| Particle | Charge | Approx. mass | Location |
|---|---|---|---|
| Proton | +1 | 1 amu | nucleus |
| Neutron | 0 | 1 amu | nucleus |
| Electron | -1 | about 1/1800 amu | outside nucleus |
- Proton count (atomic number, Z) defines the element. Changing it means a different element (nuclear process, not chemistry).
- Neutral atom: protons = electrons.
- Mass number = protons + neutrons, so neutrons = mass number - Z.
- Chemistry moves electrons, never protons.
- Ion charge = protons - electrons.
- Viz hook: build-an-atom with +/- buttons for p, n, e; live readout of element name, mass number, net charge, and "is this still the same element?" Disable p changes in "chemistry mode".

### 1.2 Isotopes
- Same protons, different neutrons (C-12, C-14). Same chemistry, different mass.
- Viz hook: nucleus view with neutron slider; element stays fixed, mass number changes.

### 1.3 Bohr-Rutherford diagrams
- Nucleus labelled with protons and neutrons (Na: 11 p+, 12 n0)
- Shell capacities (first 20 elements): shell 1 = 2, shell 2 = 8, shell 3 = 8; K and Ca start shell 4
- Fill inside out. Rings = period. Outer-shell electrons = valence electrons = group number (main groups).
- Electrons per shell, first 20:
  - H 1, He 2
  - Li 2-1, Be 2-2, B 2-3, C 2-4, N 2-5, O 2-6, F 2-7, Ne 2-8
  - Na 2-8-1, Mg 2-8-2, Al 2-8-3, Si 2-8-4, P 2-8-5, S 2-8-6, Cl 2-8-7, Ar 2-8-8
  - K 2-8-8-1, Ca 2-8-8-2
- Simplification to flag: shell 3 can really hold 18; the 3d orbitals fill after 4s. The 2-8-8 rule only works through Ca.
- Viz hook: enter Z (1-20), auto-draw rings and electrons, highlight valence electrons; toggle to ion and see the outer ring disappear or fill.

### 1.4 Periodic table tie-ins
- Period = number of shells; group = valence electrons (main groups)
- Alkali metals get more reactive going down; halogens get less reactive going down
- Viz hook: periodic table heatmap coloured by valence electrons, shells, typical ion charge.

### 1.5 Nuclear pull and screening (intuition for trends)
- Outer electrons feel the nucleus's positive charge, partly screened by inner electrons.
- Across a period: protons increase, shells stay the same, so atoms shrink and become more electron-hungry.
- Down a group: extra inner shells screen the added protons, so outer electrons are held more loosely.
- Na: 11 protons, 10 inner electrons screening most of it, so lone outer electron is loosely held. Cl: 17 protons, nearly full outer shell, so tightly held and strong pull on one more.
- Viz hook: qualitative "effective pull" bar per element (protons minus inner electrons) plotted across period 2 and 3.

---

## 2. Ions and ionic bonding

### 2.1 Why ions form (intuition)
- Atoms do not "want" a full shell. The system ends at lower energy.
- The "full shell" idea is really a cost cliff: after the outer electron(s) leave, the next ones are in an inner shell, closer to the nucleus and unscreened, so removing them costs far more energy. Adding electrons works the same way: once a shell is full, the next electron must start a distant new shell and feels almost no pull.
- Energy accounting for NaCl: removing Na's electron costs energy, so Na+ alone is not favourable. What pays for it is Na+ and Cl- attracting each other and packing into a lattice, which releases more than the transfer cost.
- Viz hook: step-by-step energy bar chart (cost to remove electron, energy released adding it to Cl, lattice energy released, net).

### 2.2 Typical ion charges (main groups)
| Group | Typical ion |
|---|---|
| 1 | +1 |
| 2 | +2 |
| 13 (Al) | +3 |
| 15 | -3 |
| 16 | -2 |
| 17 | -1 |
| 18 | none (noble gases) |
- Viz hook: periodic table with ion-charge colouring and Bohr diagrams of the ion on click.

### 2.3 Drawing ions
- Cations lose outer electrons, so the old outer ring disappears: Na (2-8-1) becomes Na+ (2-8), 11 p, 10 e.
- Anions gain into the outer shell: Cl (2-8-7) becomes Cl- (2-8-8), 17 p, 18 e.
- Brackets and charge at top right: [Na]+, [Cl]-. Nucleus unchanged.
- Ca2+ = 20 p, 18 e, shells 2-8-8 (matches argon).
- Viz hook: electron transfer animation: Na gives to Cl, both turn into brackets with charges.

### 2.3b Ionic compound diagrams
- Show transfer. Example: Mg (2-8-2) gives 2 electrons to O (2-6), giving [Mg]2+ (2-8) and [O]2- (2-8).
- Charges must add to zero; this gives the formula.

### 2.4 Crystal lattice formation
- Dry route: Na + Cl2 gives NaCl(s). Electron transfer, then ions pack into a repeating 3D grid (NaCl: 6 opposite-charge neighbours each). Lots of energy released.
- Wet route: ions already exist in solution; evaporation or cooling crowds them until they stick and a crystal grows from a seed. Crystallization is the reverse of dissolving.
- Viz hook: 3D lattice builder, ions drifting in a box and sticking to a growing seed; temperature or evaporation slider.

### 2.5 Dissociation in water
- The crystal was always ions. Dissolving just pulls apart ions that existed; no electron is "given back".
- Splitting into neutral atoms would cost energy (Cl holds the electron more tightly than Na).
- Water is polar: negative O end, positive H ends. Na+ gets surrounded by O ends, Cl- by H ends. That attraction releases energy and pays back the cost of separating the lattice (hydration).
- Ionic compounds dissolve to ions and conduct electricity in solution.
- Contrast: sugar (C12H22O11) is held by covalent bonds, dissolves as whole molecules, no ions, no conduction.
- Acid case: HCl is molecular, but water pulls off H+ and Cl keeps both electrons, giving Cl-.
- Viz hook: water molecules with partial charges; salt crystal dissolving with hydration shells; side-by-side sugar vs salt with a conductivity meter.

### 2.6 Elements dropped into water (examples)
- Sodium metal: 2Na + 2H2O gives 2NaOH + H2. Na loses its electron to water (releasing H2 and leaving OH-); heat can ignite the H2. Does not make salt.
- Chlorine gas: Cl2 + H2O in equilibrium with HCl + HOCl. Pool chemistry.
- Rust: iron losing electrons is much easier with water and ions present; dry iron barely rusts.

---

## 3. Formulas and naming

### 3.1 Binary ionic (metal + nonmetal)
- Charges must cancel. Criss-cross charges to subscripts, then reduce.
- Name: metal unchanged, nonmetal with -ide. No prefixes.
- Ending list: fluoride, chloride, bromide, iodide, oxide, sulfide, nitride, phosphide, hydride.
- Examples: Na2S, AlCl3, Al2O3, MgO (Mg2O2 reduces), Ba3N2.
- Mistakes: not reducing, prefixes on ionic names, nonmetal first, writing charges in the formula.
- Viz hook: drag-and-drop ions that snap to the smallest neutral ratio; show charge balance bar.

### 3.2 Multivalent metals
- Roman numeral = the metal's charge (iron(III) oxide = Fe3+ with O2- gives Fe2O3).
- Common: Fe 2+/3+, Cu 1+/2+, Pb 2+/4+, Sn 2+/4+. Also Mn, Cr, Co, Ni, Hg (varies by textbook).
- Single-charge transition metals with no numeral: Zn2+, Ag+, Cd2+ (check textbook).
- Formula to name: metal charge = total negative charge / number of metal atoms (Fe2O3: 6-/2 = 3+).
- Older -ous/-ic names (ferrous/ferric) may appear.
- Format: iron(II) sulfide (no space before bracket, capital numeral).
- Mistakes: numeral used as subscript, numeral added for Na/Ca/Al, forgetting to reduce.
- Viz hook: same metal-nonmetal pair showing both charge variants side by side (CuCl vs CuCl2).

### 3.3 Polyatomic ions
| Ion | Formula | Charge |
|---|---|---|
| Ammonium | NH4 | +1 |
| Hydroxide | OH | -1 |
| Nitrate | NO3 | -1 |
| Hydrogen carbonate | HCO3 | -1 |
| Acetate | CH3COO | -1 |
| Carbonate | CO3 | -2 |
| Sulfate | SO4 | -2 |
| Phosphate | PO4 | -3 |
- Possible extras: nitrite NO2-, sulfite SO3 2-, phosphite PO3 3-, chlorate ClO3-, permanganate MnO4-, chromate CrO4 2-, cyanide CN-.
- Patterns: -ite has one fewer oxygen than -ate with the same charge; adding H+ reduces the charge by 1.
- Brackets with outside subscript when 2+ of the ion: Ca(NO3)2, (NH4)2SO4, Al2(SO4)3, Mg3(PO4)2.
- Name: metal or ammonium, then ion name. No -ide (exceptions: hydroxide, cyanide).
- With multivalent metals, find the metal charge from the polyatomic charge: Fe(OH)3 is iron(III) hydroxide.
- Mistakes: changing subscripts inside the ion, brackets for a single ion, sulfate/sulfide and nitrate/nitrite mix-ups.
- Viz hook: ion cards with a "bracket needed?" auto-check; ball-and-stick view of each polyatomic ion.

### 3.4 Molecular compounds (nonmetal + nonmetal)
- Covalent sharing, no ions. Prefix in the name gives the subscript. Do not reduce.
- Prefixes: 1 mono, 2 di, 3 tri, 4 tetra, 5 penta, 6 hexa, 7 hepta, 8 octa, 9 nona, 10 deca.
- Drop "mono" on the first element only. Drop final a/o before a vowel (monoxide, tetroxide, pentoxide).
- Element order: less electronegative first (rough order C, P, S, N, H, O, then halogens).
- Examples: CO2, CO, N2O (dinitrogen monoxide), N2O4, N2O5, PCl5, SF6, CCl4, P4O10.
- Why prefixes here: nonmetal pairs combine in several ratios (CO vs CO2).
- Type check: metal + nonmetal (or ammonium or polyatomic) = ionic; nonmetal + nonmetal = molecular.
- Viz hook: ball-and-stick molecule builder that outputs the name; classifier that asks "ionic or molecular?" first.

### 3.5 Diatomics and common names (outlined, not yet reviewed in detail)
- Diatomic elements: H2, N2, O2, F2, Cl2, Br2, I2 (treat as pairs when balancing).
- Common names: H2O water, NH3 ammonia, CH4 methane, H2O2 hydrogen peroxide, C2H6 ethane, C3H8 propane, C4H10 butane, C6H12O6 glucose.

### Test cases for naming sim
- Ba + N gives Ba3N2, barium nitride
- FeCl2 gives iron(II) chloride; Cu2O gives copper(I) oxide
- K2CO3, Fe(NO3)2
- N2O5 gives dinitrogen pentoxide; sulfur trioxide gives SO3

---

## 4. Conservation of mass and balancing (outlined)
- Atoms are rearranged, not created or destroyed.
- Change coefficients only, never subscripts.
- Order: metals, nonmetals, H, then O last. Keep polyatomic ions intact.
- Example: 4Al + 3O2 gives 2Al2O3 (4 Al and 6 O each side).
- Common errors: changing subscripts, forgetting diatomics.
- Viz hook: balancing game with atom counters per element on both sides; coefficients as sliders; mass bar stays equal.

## 5. Reaction types (outlined)
- Synthesis: A + B gives AB
- Decomposition: AB gives A + B
- Single replacement: A + BC gives AC + B (metal only replaces a less reactive metal)
- Double replacement: AB + CD gives AD + CB (needs precipitate, gas or water)
- Hydrocarbon combustion: CxHy + O2 gives CO2 + H2O + energy
- Viz hook: animated particle diagrams per type; activity series to predict single replacement.

## 6. Acids and bases (outlined)
- Acids: H first in formula, sour, pH below 7, turn blue litmus red. Bases: usually contain OH, slippery, pH above 7, turn red litmus blue.
- pH is logarithmic: each step is a factor of 10 in H+; pH 3 is 100 times more acidic than pH 5.
- Neutralization: acid + base gives salt + water (double replacement), e.g. HCl + NaOH gives NaCl + H2O.
- Viz hook: pH slider with H+ and OH- particle counts on a log scale; titration curve.

## 7. Energy in reactions (outlined)
- Breaking bonds absorbs energy; forming bonds releases it.
- Exothermic: net release, surroundings warm. Endothermic: net absorption, surroundings cool.
- Energy, like mass, is conserved (moves between system and surroundings).
- Viz hook: bond-energy bookkeeping bar chart for a simple reaction; temperature trace of surroundings.

---

## Common student errors (for sim hints)
- Gaining/losing a proton when making an ion (it is electrons)
- More than 8 electrons on shell 2, or starting shell 3 early
- Changing the nucleus count in an ion diagram
- Missing brackets and charge on ion diagrams
- Not reducing ionic formulas
- Prefixes on ionic names
- Numeral read as atom count, not charge
- Changing subscripts to balance
- Treating pH as linear
