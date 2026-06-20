# Graph Report - .  (2026-06-20)

## Corpus Check
- Corpus is ~15,316 words - fits in a single context window. You may not need a graph.

## Summary
- 38 nodes · 47 edges · 10 communities (5 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Portfolio Pages & Content|Portfolio Pages & Content]]
- [[_COMMUNITY_FastAPI Routes & Handlers|FastAPI Routes & Handlers]]
- [[_COMMUNITY_Documentation & Tech Stack|Documentation & Tech Stack]]
- [[_COMMUNITY_Frontend JavaScript|Frontend JavaScript]]
- [[_COMMUNITY_Contact Form Flow|Contact Form Flow]]
- [[_COMMUNITY_About Section Image|About Section Image]]
- [[_COMMUNITY_Profile Image Asset|Profile Image Asset]]
- [[_COMMUNITY_Project 1 Image|Project 1 Image]]
- [[_COMMUNITY_Project 2 Image|Project 2 Image]]

## God Nodes (most connected - your core abstractions)
1. `Home Page Template (all sections)` - 11 edges
2. `Request` - 6 edges
3. `AI Engineer Portfolio README` - 6 edges
4. `Base Template (nav, footer, head)` - 6 edges
5. `render()` - 4 edges
6. `Python Dependencies Manifest` - 4 edges
7. `Jinja2 Templating Engine (3.1.2)` - 4 edges
8. `home()` - 3 edges
9. `Contact Form Component (POST /submit_contact)` - 3 edges
10. `FastAPI Web Framework (0.104.1)` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Home Page Template (all sections)` --references--> `Gaurav Poudel CV (PDF)`  [EXTRACTED]
  app/templates/index.html → Gaurav_Poudel_CV.pdf
- `Graphify Project Instructions` --conceptually_related_to--> `AI Engineer Portfolio README`  [INFERRED]
  CLAUDE.md → README.md
- `AI Engineer Portfolio README` --references--> `Docker Compose Web Service (port 8000)`  [EXTRACTED]
  README.md → docker-compose.yml
- `AI Engineer Portfolio README` --references--> `Base Template (nav, footer, head)`  [EXTRACTED]
  README.md → app/templates/base.html
- `Base Template (nav, footer, head)` --implements--> `Jinja2 Templating Engine (3.1.2)`  [EXTRACTED]
  app/templates/base.html → requirements.txt

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Jinja2 Template Inheritance Hierarchy** — templates_base, templates_index, templates_about, templates_projects, templates_contact [EXTRACTED 1.00]
- **Portfolio Selected Work / Case Studies** — project_neuroscope_ai, project_gym_calories_predictor, project_moviegpt [EXTRACTED 1.00]

## Communities (10 total, 5 thin omitted)

### Community 0 - "Portfolio Pages & Content"
Cohesion: 0.29
Nodes (10): Gaurav Poudel CV (PDF), 4-Step Process Workflow (Discover, Design, Build, Ship), Gym Calories Burned Predictor (ML Ensemble), MovieGPT - Content-based Movie Recommender (TF-IDF + Cosine Similarity, TMDB), NeuroScope AI - Multi-agent Generative AI System, About Page Template, Base Template (nav, footer, head), Contact Page Template (+2 more)

### Community 1 - "FastAPI Routes & Handlers"
Cohesion: 0.39
Nodes (8): about(), contact(), home(), projects(), render(), submit_contact(), HTMLResponse, Request

### Community 2 - "Documentation & Tech Stack"
Cohesion: 0.53
Nodes (6): Graphify Project Instructions, Docker Compose Web Service (port 8000), AI Engineer Portfolio README, Python Dependencies Manifest, FastAPI Web Framework (0.104.1), Jinja2 Templating Engine (3.1.2)

### Community 4 - "Contact Form Flow"
Cohesion: 0.67
Nodes (3): Contact Email - gauravpoudel1068@gmail.com, Contact Form Component (POST /submit_contact), SendGrid Email API Client (6.11.0)

## Knowledge Gaps
- **9 isolated node(s):** `HTMLResponse`, `Graphify Project Instructions`, `Gaurav Poudel CV (PDF)`, `Gym Calories Burned Predictor (ML Ensemble)`, `Contact Email - gauravpoudel1068@gmail.com` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Home Page Template (all sections)` connect `Portfolio Pages & Content` to `Documentation & Tech Stack`, `Contact Form Flow`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `AI Engineer Portfolio README` connect `Documentation & Tech Stack` to `Portfolio Pages & Content`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Base Template (nav, footer, head)` connect `Portfolio Pages & Content` to `Documentation & Tech Stack`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `HTMLResponse`, `Graphify Project Instructions`, `Gaurav Poudel CV (PDF)` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._