(() => {
  // src/assets/js/tagify.js
  (() => {
    "use strict";
    if (typeof Tagify !== "function") return;
    const inputtagify = document.querySelector("input[name=basic]");
    if (inputtagify) {
      new Tagify(inputtagify);
    }
    const input = document.querySelector("input[name=tags4]");
    if (input) {
      const tagify = new Tagify(input);
    }
    const input2 = document.querySelector("input[name=tags-readonly-mix]");
    if (input2) {
      const tagify2 = new Tagify(input2);
    }
    const inputCustom = document.querySelector('input[name="input-custom-dropdown"]');
    if (inputCustom) {
      const tagify3 = new Tagify(inputCustom, {
        whitelist: ["A# .NET", "A# (Axiom)", "A-0 System", "A+", "A++", "ABAP", "ABC", "ABC ALGOL", "ABSET", "ABSYS", "ACC", "Accent", "Ace DASL", "ACL2", "Avicsoft", "ACT-III", "Action!", "ActionScript", "Ada", "Adenine", "Agda", "Agilent VEE", "Agora", "AIMMS", "Alef", "ALF", "ALGOL 58", "ALGOL 60", "ALGOL 68", "ALGOL W", "Alice", "Alma-0", "AmbientTalk", "Amiga E", "AMOS", "AMPL", "Apex (Salesforce.com)", "APL", "AppleScript", "Arc", "ARexx", "Argus", "AspectJ", "Assembly language", "ATS", "Ateji PX", "AutoHotkey", "Autocoder", "AutoIt", "AutoLISP / Visual LISP", "Averest", "AWK", "Axum", "Active Server Pages", "ASP.NET", "B", "Babbage", "Bash", "BASIC", "bc", "BCPL", "BeanShell", "Batch (Windows/Dos)", "Bertrand", "BETA", "Bigwig", "Bistro", "BitC", "BLISS", "Blockly", "BlooP", "Blue", "Boo", "Boomerang", "Bourne shell (including bash and ksh)", "BREW", "BPEL", "B", "C--", "C++ \u2013 ISO/IEC 14882", "C# \u2013 ISO/IEC 23270", "C/AL", "Cach\xE9 ObjectScript", "C Shell", "Caml", "Cayenne", "CDuce", "Cecil", "Cesil", "C\xE9u", "Ceylon", "CFEngine", "CFML", "Cg", "Ch", "Chapel", "Charity", "Charm", "Chef", "CHILL", "CHIP-8", "chomski", "ChucK", "CICS", "Cilk", "Citrine (programming language)", "CL (IBM)", "Claire", "Clarion", "Clean", "Clipper", "CLIPS", "CLIST", "Clojure", "CLU", "CMS-2", "COBOL \u2013 ISO/IEC 1989", "CobolScript \u2013 COBOL Scripting language", "Cobra", "CODE", "CoffeeScript", "ColdFusion", "COMAL", "Combined Programming Language (CPL)", "COMIT", "Common Intermediate Language (CIL)", "Common Lisp (also known as CL)", "COMPASS", "Component Pascal", "Constraint Handling Rules (CHR)", "COMTRAN", "Converge", "Cool", "Coq", "Coral 66", "Corn", "CorVision", "COWSEL", "CPL", "CPL", "Cryptol", "csh", "Csound", "CSP", "CUDA", "Curl", "Curry", "Cybil", "Cyclone", "Cython", "Java", "Javascript", "M2001", "M4", "M#", "Machine code", "MAD (Michigan Algorithm Decoder)", "MAD/I", "Magik", "Magma", "make", "Maple", "MAPPER now part of BIS", "MARK-IV now VISION:BUILDER", "Mary", "MASM Microsoft Assembly x86", "MATH-MATIC", "Mathematica", "MATLAB", "Maxima (see also Macsyma)", "Max (Max Msp \u2013 Graphical Programming Environment)", "Maya (MEL)", "MDL", "Mercury", "Mesa", "Metafont", "Microcode", "MicroScript", "MIIS", "Milk (programming language)", "MIMIC", "Mirah", "Miranda", "MIVA Script", "ML", "Model 204", "Modelica", "Modula", "Modula-2", "Modula-3", "Mohol", "MOO", "Mortran", "Mouse", "MPD", "Mathcad", "MSIL \u2013 deprecated name for CIL", "MSL", "MUMPS", "Mystic Programming L"],
        maxTags: 10,
        dropdown: {
          maxItems: 20,
          // <- mixumum allowed rendered suggestions
          classname: "tags-look",
          // <- custom classname for this dropdown, so it could be targeted
          enabled: 0,
          // <- show suggestions on focus
          closeOnSelect: false
          // <- do not hide the suggestions dropdown once an item has been selected
        }
      });
    }
    const inputDisabled = document.querySelector("input[name=tags-disabled-user-input]");
    if (inputDisabled) {
      new Tagify(inputDisabled, {
        whitelist: [1, 2, 3, 4, 5],
        userInput: false
      });
    }
    const input5 = document.querySelector("input[name=drag-sort]");
    if (input5) {
      const tagify5 = new Tagify(input5);
      if (typeof DragSort === "function") {
        new DragSort(tagify5.DOM.scope, {
          selector: "." + tagify5.settings.classNames.tag,
          callbacks: { dragEnd: () => tagify5.updateValueByDOMTags() }
        });
      }
    }
    const input6 = document.querySelector("input[name=tags-select-mode]");
    if (input6) {
      let onAddTag = function(e) {
      }, onSelectFocus = function(e) {
      };
      const tagify6 = new Tagify(input6, {
        enforceWhitelist: true,
        mode: "select",
        whitelist: ["first option", "second option", "third option"],
        blacklist: ["foo", "bar"]
      });
      tagify6.on("add", onAddTag);
      tagify6.DOM.input.addEventListener("focus", onSelectFocus);
    }
    const whitelist_1 = [
      { value: 100, text: "kenny", title: "Kenny McCormick" },
      { value: 200, text: "cartman", title: "Eric Cartman" },
      { value: 300, text: "kyle", title: "Kyle Broflovski" },
      { value: 400, text: "token", title: "Token Black" },
      { value: 500, text: "jimmy", title: "Jimmy Valmer" },
      { value: 600, text: "butters", title: "Butters Stotch" },
      { value: 700, text: "stan", title: "Stan Marsh" },
      { value: 800, text: "randy", title: "Randy Marsh" },
      { value: 900, text: "Mr. Garrison", title: "POTUS" },
      { value: 1e3, text: "Mr. Mackey", title: "M'Kay" }
    ];
    const whitelist_2 = ["Homer simpson", "Marge simpson", "Bart", "Lisa", "Maggie", "Mr. Burns", "Ned", "Milhouse", "Moe"];
    const input7 = document.querySelector("[name=mix]");
    if (input7) {
      const tagify7 = new Tagify(input7, {
        //  mixTagsInterpolator: ["{{", "}}"],
        mode: "mix",
        // <--  Enable mixed-content
        pattern: /@|#/,
        // <--  Text starting with @ or # (if single, String can be used here)
        tagTextProp: "text",
        // <-- the default property (from whitelist item) for the text to be rendered in a tag element.
        // Array for initial interpolation, which allows only these tags to be used
        whitelist: whitelist_1.concat(whitelist_2).map(function(item) {
          return typeof item == "string" ? { value: item } : item;
        }),
        // custom validation - no special characters
        validate(data) {
          return !/[^a-zA-Z0-9 ]/.test(data.value);
        },
        dropdown: {
          enabled: 1,
          position: "text",
          // <-- render the suggestions list next to the typed text ("caret")
          mapValueTo: "text",
          // <-- similar to above "tagTextProp" setting, but for the dropdown items
          highlightFirst: true
          // automatically highlights first sugegstion item in the dropdown
        },
        callbacks: {}
      });
      tagify7.on("input", function(e) {
        const prefix = e.detail.prefix;
        if (prefix) {
          if (prefix == "@")
            tagify7.whitelist = whitelist_1;
          if (prefix == "#")
            tagify7.whitelist = whitelist_2;
          if (e.detail.value.length > 1)
            tagify7.dropdown.show(e.detail.value);
        }
      });
      tagify7.on("add", function(e) {
      });
    }
    const inputElm = document.querySelector("input[name=users-list-tags]");
    function tagTemplate(tagData) {
      return `
        <tag title="${tagData.email}"
                contenteditable='false'
                spellcheck='false'
                tabIndex="-1"
                class="tagify__tag ${tagData.class ? tagData.class : ""}"
                ${this.getAttributes(tagData)}>
            <x title='' class='tagify__tag__removeBtn' role='button' aria-label='remove tag'></x>
            <div>
                <div class='tagify__tag__avatar-wrap'>
                    <img onerror="this.style.visibility='hidden'" src="${tagData.avatar}">
                </div>
                <span class='tagify__tag-text'>${tagData.name}</span>
            </div>
        </tag>
    `;
    }
    function suggestionItemTemplate(tagData) {
      return `
        <div ${this.getAttributes(tagData)}
            class='tagify__dropdown__item ${tagData.class ? tagData.class : ""}'
            tabindex="0"
            role="option">
            ${tagData.avatar ? `
                <div class='tagify__dropdown__item__avatar-wrap'>
                    <img onerror="this.style.visibility='hidden'" src="${tagData.avatar}">
                </div>` : ""}
            <strong>${tagData.name}</strong>
            <span>${tagData.email}</span>
        </div>
    `;
    }
    function dropdownHeaderTemplate(suggestions) {
      return `
        <header data-selector='tagify-suggestions-header' class="${this.settings.classNames.dropdownItem} ${this.settings.classNames.dropdownItem}__addAll">
            <strong style='grid-area: add'>${this.value.length ? `Add Remaning` : "Add All"}</strong>
            <span style='grid-area: remaning'>${suggestions.length} members</span>
            <a class='remove-all-tags'>Remove all</a>
        </header>
    `;
    }
    if (inputElm) {
      let onSelectSuggestion = function(e) {
        if (e.detail.event.target.matches(".remove-all-tags")) {
          tagify8.removeAllTags();
        } else if (e.detail.elm.classList.contains(`${tagify8.settings.classNames.dropdownItem}__addAll`))
          tagify8.dropdown.selectAll();
      }, onEditStart = function({ detail: { tag, data } }) {
        tagify8.setTagTextNode(tag, `${data.name} <${data.email}>`);
      }, validateEmail = function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }, parseFullValue = function(value) {
        const parts = value.split(/<(.*?)>/g), name = parts[0].trim(), email = parts[1]?.replace(/<(.*?)>/g, "").trim();
        return { name, email };
      };
      const tagify8 = new Tagify(inputElm, {
        tagTextProp: "name",
        // very important since a custom template is used with this property as text
        // enforceWhitelist: true,
        skipInvalid: true,
        // do not remporarily add invalid tags
        dropdown: {
          closeOnSelect: false,
          enabled: 0,
          classname: "users-list",
          searchKeys: ["name", "email"]
          // very important to set by which keys to search for suggesttions when typing
        },
        templates: {
          tag: tagTemplate,
          dropdownItem: suggestionItemTemplate,
          dropdownHeader: dropdownHeaderTemplate
        },
        whitelist: [
          {
            "value": 1,
            "name": "Justinian Hattersley",
            "avatar": "https://i.pravatar.cc/80?img=1",
            "email": "jhattersley0@ucsd.edu",
            "team": "A"
          },
          {
            "value": 2,
            "name": "Antons Esson",
            "avatar": "https://i.pravatar.cc/80?img=2",
            "email": "aesson1@ning.com",
            "team": "B"
          },
          {
            "value": 3,
            "name": "Ardeen Batisse",
            "avatar": "https://i.pravatar.cc/80?img=3",
            "email": "abatisse2@nih.gov",
            "team": "A"
          },
          {
            "value": 4,
            "name": "Graeme Yellowley",
            "avatar": "https://i.pravatar.cc/80?img=4",
            "email": "gyellowley3@behance.net",
            "team": "C"
          },
          {
            "value": 5,
            "name": "Dido Wilford",
            "avatar": "https://i.pravatar.cc/80?img=5",
            "email": "dwilford4@jugem.jp",
            "team": "A"
          },
          {
            "value": 6,
            "name": "Celesta Orwin",
            "avatar": "https://i.pravatar.cc/80?img=6",
            "email": "corwin5@meetup.com",
            "team": "C"
          },
          {
            "value": 7,
            "name": "Sally Main",
            "avatar": "https://i.pravatar.cc/80?img=7",
            "email": "smain6@techcrunch.com",
            "team": "A"
          },
          {
            "value": 8,
            "name": "Grethel Haysman",
            "avatar": "https://i.pravatar.cc/80?img=8",
            "email": "ghaysman7@mashable.com",
            "team": "B"
          },
          {
            "value": 9,
            "name": "Marvin Mandrake",
            "avatar": "https://i.pravatar.cc/80?img=9",
            "email": "mmandrake8@sourceforge.net",
            "team": "B"
          },
          {
            "value": 10,
            "name": "Corrie Tidey",
            "avatar": "https://i.pravatar.cc/80?img=10",
            "email": "ctidey9@youtube.com",
            "team": "A"
          },
          {
            "value": 11,
            "name": "foo",
            "avatar": "https://i.pravatar.cc/80?img=11",
            "email": "foo@bar.com",
            "team": "B"
          },
          {
            "value": 12,
            "name": "foo",
            "avatar": "https://i.pravatar.cc/80?img=12",
            "email": "foo.aaa@foo.com",
            "team": "A"
          }
        ],
        transformTag: (tagData, originalData) => {
          const { name, email } = parseFullValue(tagData.name);
          tagData.name = name;
          tagData.email = email || tagData.email;
        },
        validate({ name, email }) {
          if (!email && name) {
            const parsed = parseFullValue(name);
            name = parsed.name;
            email = parsed.email;
          }
          if (!name) return "Missing name";
          if (!validateEmail(email)) return "Invalid email";
          return true;
        }
      });
      tagify8.dropdown.createListHTML = (sugegstionsList) => {
        const teamsOfUsers = sugegstionsList.reduce((acc, suggestion) => {
          const team = suggestion.team || "Not Assigned";
          if (!acc[team])
            acc[team] = [suggestion];
          else
            acc[team].push(suggestion);
          return acc;
        }, {});
        const getUsersSuggestionsHTML = (teamUsers) => teamUsers.map((suggestion, idx) => {
          if (typeof suggestion == "string" || typeof suggestion == "number")
            suggestion = { value: suggestion };
          const value = tagify8.dropdown.getMappedValue.call(tagify8, suggestion);
          suggestion.value = value && typeof value == "string" ? escapeHTML(value) : value;
          return tagify8.settings.templates.dropdownItem.apply(tagify8, [suggestion]);
        }).join("");
        return Object.entries(teamsOfUsers).map(([team, teamUsers]) => {
          return `<div class="tagify__dropdown__itemsGroup" data-title="Team ${team}:">${getUsersSuggestionsHTML(teamUsers)}</div>`;
        }).join("");
      };
      tagify8.on("dropdown:select", onSelectSuggestion).on("edit:start", onEditStart);
    }
  })();
})();
