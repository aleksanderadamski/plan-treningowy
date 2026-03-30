// Workout definitions — exported as an ES module so app.js can import them.
// Each top-level key matches a page-pane id in index.html.
// Each slot has an `options` array; the user picks one per training session.

export const workouts = {
    push: [
        { options: [{ name: "Wyciskanie sztangi na ławce płaskiej", sets: "4x6-8" }, { name: "Wyciskanie hantli (płasko)", sets: "4x6-8" }, { name: "Wyciskanie na maszynie siedząc (klatka)", sets: "4x8-10" }]},
        { options: [{ name: "Wyciskanie hantli (skośna)", sets: "3x8-12" }, { name: "Wyciskanie sztangi na ławce skośnej", sets: "3x8-12" }, { name: "Wyciskanie na maszynie Smitha (skos dodatni)", sets: "3x8-12" }]},
        { options: [{ name: "Pompki na poręczach (z obciążeniem)", sets: "3x8-12" }, { name: "Wyciskanie hantli nad głowę (siedząc)", sets: "3x8-12" }, { name: "Wyciskanie żołnierskie (sztanga stojąc)", sets: "3x6-8" }]},
        { options: [{ name: "Wznosy hantli bokiem", sets: "4x10-15" }, { name: "Wznosy linek wyciągu w bok", sets: "4x10-15" }, { name: "Wznosy bokiem na maszynie", sets: "4x12-15" }]},
        { options: [{ name: "Rozpiętki z hantlami", sets: "3x8-12"}, { name: "Rozpiętki z linkami wyciągu (brama)", sets: "3x12-15" }, { name: "Rozpiętki na maszynie 'Butterfly'", sets: "3x12-15" }]}, 
        { options: [{ name: "Prostowanie ramion (linka wyciągu) z dropsetem", sets: "3x10-15" }, { name: "Wyciskanie francuskie sztangą łamaną", sets: "3x8-12" }, { name: "Wyciskanie francuskie hantlami (młotkowo)", sets: "3x10-12" }]}
    ],
    pull: [
        { options: [{ name: "Podciąganie na drążku (nachwyt)", sets: "4xMAX" }, { name: "Ściąganie drążka wyciągu", sets: "4x8-12" }, { name: "Ściąganie na maszynie typu Hammer", sets: "4x8-12" }]},
        { options: [{ name: "Wiosłowanie sztangą (opad tułowia)", sets: "4x6-8" }, { name: "Wiosłowanie hantlem", sets: "4x8-10" }, { name: "Wiosłowanie półsztangą (T-Bar)", sets: "4x8-10" }]},
        { options: [{ name: "Przyciąganie uchwytu V (siedząc)", sets: "3x10-12" }, { name: "Wiosłowanie na maszynie siedząc", sets: "3x10-12" }, { name: "Wiosłowanie hantlami leżąc na ławce (chest supported)", sets: "3x10-12" }]},
        { options: [{ name: "Ściąganie drążka (proste ramiona)", sets: "3x12-15" }, { name: "Face pulls (linka)", sets: "3x15-20" }, { name: "Odwrotne rozpiętki na maszynie (tył barku)", sets: "3x12-15" }]},
        { options: [{ name: "Uginanie ramion ze sztangą", sets: "4x8-10" }, { name: "Uginanie z hantlami (supinacja)", sets: "4x8-10" }, { name: "Uginanie ramion z linkami wyciągu dolnego", sets: "4x10-12" }]},
        { options: [{ name: "Uginanie ramion z hantlami na ławce skośnej", sets: "3x10-15" }, { name: "Uginanie ramion na modlitewniku", sets: "3x10-15" }, { name: "Uginanie młotkowe z hantlami", sets: "3x10-12" }]}
    ],
    legs: [
        { options: [{ name: "Przysiady ze sztangą na plecach", sets: "4x6-8" }, { name: "Wypychanie ciężaru na suwnicy", sets: "4x8-10" }, { name: "Przysiady na maszynie Hack", sets: "4x8-10" }]},
        { options: [{ name: "Martwy ciąg na prostych nogach (RDL)", sets: "3x8-12" }, { name: "Uginanie nóg na maszynie leżąc", sets: "3x10-12" }, { name: "Uginanie nóg na maszynie siedząc", sets: "3x10-12" }]},
        { options: [{ name: "Przysiady bułgarskie", sets: "3x8-12 (na nogę)" }, { name: "Wykroki z hantlami", sets: "3x10-12 (na nogę)" }, { name: "Zakroki ze sztangą/hantlami", sets: "3x10-12 (na nogę)" }]},
        { options: [{ name: "Prostowanie nóg na maszynie siedząc", sets: "3x12-15" }, { name: "Przysiad Goblet", sets: "3x12-15" }, { name: "Przysiad syzyfowy (Sissy Squat)", sets: "3xMAX" }]},
        { options: [{ name: "Hip Thrust ze sztangą", sets: "4x8-12" }, { name: "'Żuraw' (Glute Ham Raise)", sets: "3xMAX" }, { name: "Wyprosty tułowia na ławce rzymskiej (pod pośladki)", sets: "3x12-15" }]},
        { options: [{ name: "Wspięcia na palce (stojąc)", sets: "4x12-20" }, { name: "Wspięcia na palce na suwnicy", sets: "4x15-25" }, { name: "Wspięcia na palce siedząc", sets: "4x15-25" }]}
    ],
    brzuch: [
        { options: [{ name: "Allahy (linka wyciągu)", sets: "4x10-15" }, { name: "Spięcia brzucha na maszynie", sets: "4x10-15" }, { name: "Spięcia leżąc z talerzem na klatce", sets: "4x12-15" }]},
        { options: [{ name: "Unoszenie nóg w zwisie na drążku", sets: "4xMAX" }, { name: "Unoszenie kolan do klatki piersiowej w zwisie", sets: "4xMAX" }, { name: "Scyzoryki (V-ups)", sets: "4x15-20" }]},
        { options: [{ name: "Plank", sets: "4x60-90s" }, { name: "Plank boczny", sets: "3x45-60s (na str.)" }, { name: "Ab Wheel (kółko)", sets: "3x10-15" }]},
        { options: [{ name: "Wood choppers (rąbanie drewna)", sets: "3x12-15 (na str.)" }, { name: "Russian Twist (skręty tułowia)", sets: "3x15 (na stronę)" }, { name: "Pallof Press (antyrotacja z gumą/linką)", sets: "3x12-15 (na str.)" }]}
    ],
    "trening-a": [
        { options: [
            { name: "Przysiad ze sztangą na plecach", sets: "3x5-8" },
            { name: "Przysiad ze sztangą z przodu (Front Squat)", sets: "3x6-10" },
            { name: "Przysiad typu Goblet", sets: "3x10-12" }
        ]},
        { options: [
            { name: "Wyciskanie sztangi na ławce poziomej", sets: "3x6-10" },
            { name: "Wyciskanie hantli na ławce poziomej", sets: "3x8-12" },
            { name: "Pompki na poręczach (wersja na klatkę)", sets: "3xMax / 8-10" }
        ]},
        { options: [
            { name: "Podciąganie na drążku (nachwyt)", sets: "3xMax / 6-10" },
            { name: "Ściąganie drążka wyciągu górnego do klatki", sets: "3x8-12" },
            { name: "Podciąganie nachwytem na maszynie z asystą", sets: "3x8-10" }
        ]},
        { options: [
            { name: "Wyciskanie żołnierskie (OHP)", sets: "3x8-12" },
            { name: "Wyciskanie hantli nad głowę oburącz", sets: "3x8-12" },
            { name: "Wyciskanie typu Landmine (półsztanga)", sets: "3x10-12" }
        ]},
        { options: [
            { name: "Plank (Deska)", sets: "3x45-60s" },
            { name: "Dead Bug (Zdechły robak)", sets: "3x10-12 na stronę" },
            { name: "Hollow Body Hold", sets: "3x30-45s" }
        ]}
    ],
    "trening-b": [
        { options: [
            { name: "Martwy ciąg (Klasyczny)", sets: "3x5" },
            { name: "Martwy ciąg rumuński (RDL)", sets: "3x8-10" },
            { name: "Martwy ciąg ze sztangą Trap Bar", sets: "3x5-8" }
        ]},
        { options: [
            { name: "Wyciskanie hantli na skosie dodatnim", sets: "3x8-12" },
            { name: "Wyciskanie sztangi na skosie dodatnim", sets: "3x6-10" },
            { name: "Wyciskanie na maszynie Smitha (skos dodatni)", sets: "3x8-12" }
        ]},
        { options: [
            { name: "Wiosłowanie sztangą w opadzie", sets: "3x6-10" },
            { name: "Wiosłowanie hantlem w oparciu o ławkę", sets: "3x8-12 na stronę" },
            { name: "Wiosłowanie półsztangą (Landmine Row)", sets: "3x8-12" }
        ]},
        { options: [
            { name: "Wykroki chodzone", sets: "3x10-12 na nogę" },
            { name: "Przysiady bułgarskie", sets: "3x8-10 na nogę" },
            { name: "Wejścia na podwyższenie (Step-ups)", sets: "3x10-12 na nogę" }
        ]},
        { options: [
            { name: "Dipy (Pompki na poręczach)", sets: "3x8-12" },
            { name: "Wyciskanie sztangi wąskim chwytem", sets: "3x6-10" },
            { name: "Wyciskanie francuskie (Skullcrushers)", sets: "3x10-12" }
        ]}
    ]
};
