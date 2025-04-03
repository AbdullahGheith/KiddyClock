# KiddyClock

Farvet ur afhængigt af, hvad der er planlagt – perfekt til børn, der endnu ikke har lært klokken.

**Preview:** [https://abdullahgheith.github.io/KiddyClock/](https://abdullahgheith.github.io/KiddyClock/)

---

## Sådan tilpasser du tiderne

Der er flere måder at ændre tiderne, så de passer til dit eget program:

### 1. Manuel metode

- Download alle filerne.
- Åbn `script.js` og find sektionen med `setTimeRange`.
- Her kan du ændre tidsintervaller, farver og billeder. F.eks.:

```javascript
setTimeRange(6, 45, 7, 0, "yellow", "clothes.png");
// Mellem 6.45 og 7.00 skal uret være gult og vise clothes.png
