# VS Code theke run kora (Chrome e window khulbe)

## Age ja korte hobe
1. `doctor-finder.zip` ta **Extract** koro (right click → Extract All).
2. VS Code kholo → **File → Open Folder** → `doctor-finder` folder ta select koro.
   (Folder khulte hobe, shudhu ekta file na. Na hole run korar setting kaj korbe na.)
3. VS Code "Do you trust the authors?" jiggesh korle **Yes, I trust** dao.

## Way 1: kono extension lage na (Ctrl + Shift + B)
- Keyboard e **Ctrl + Shift + B** chap.
- Chrome e notun window khule website dekhabe.
- Eta `.vscode/tasks.json` file er kaj. Windows, Mac, Linux, tinte-i cholbe.

## Way 2: Live Server (recommended, code bodle automatic reload hoy)
1. VS Code e **Ctrl + Shift + X** chap → search koro **Live Server** (Ritwick Dey) → **Install**.
2. `index.html` e right click → **Open with Live Server**.
   (ba niche dan kone **Go Live** button e click koro.)
3. Chrome khulbe, address hobe `http://127.0.0.1:5500/index.html`.
4. Ekhon kono file (html / css / js) e kichu likhe **Ctrl + S** dile Chrome nijei reload hoye notun change dekhabe.
5. Bondho korte niche dan kone **Port: 5500** e click koro.
- Chrome ta chaibei `.vscode/settings.json` e thik kora ache.

## File gulo kibhabe connected
`index.html` er shesher dike ei line gulo shob file ke jure dey:
```html
<link rel="stylesheet" href="css/style.css" />   <!-- CSS file -->
<script src="js/data.js"></script>                <!-- JavaScript files, ei order e -->
<script src="js/geo.js"></script>
<script src="js/utils.js"></script>
<script src="js/storage.js"></script>
<script src="js/dropdown.js"></script>
<script src="js/finder.js"></script>
<script src="js/booking.js"></script>
<script src="js/appointments.js"></script>
<script src="js/main.js"></script>
```
- **HTML** = `index.html` (structure)
- **CSS** = `css/style.css` (design)
- **JavaScript** = `js/` folder er 9 ta file (logic)
- File er naam ba folder bodlale `index.html` er oi line ta-o bodlate hobe.

## Ekta jinish mathay rakho
Data browser er **address** onujayi alada save hoy. Tai
- `C:\...\index.html` (Way 1) ar `http://127.0.0.1:5500` (Way 2) e data **alada** thakbe.
- Ek way theke onno way te gele data dekhabe na. **My Appointments → Save Backup** diye backup niye onno jaygay **Restore Backup** koro.
- Sir ke dekhanor shomoy ekta way-i use koro.

## Jodi Chrome na khole
- Chrome install ache ki dekho. Na thakle Way 2 te `.vscode/settings.json` e `"chrome"` er jaygay `"microsoft-edge"` ba `"firefox"` likho.
- Excel er .xlsx file er jonno internet lagbe, internet na thakle .csv file save hoy.
