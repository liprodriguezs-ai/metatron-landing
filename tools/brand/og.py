"""Social share images (OG / square / story) with outlined text. argv[1] = output dir."""
import sys, os, subprocess
sys.path.insert(0, os.path.dirname(__file__))
import build_logo as B
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'public', 'og')
IMG = os.path.join(ROOT, 'src', 'assets', 'img')
TMP = os.path.join(os.path.dirname(__file__), 'out', 'og-work')
os.makedirs(TMP, exist_ok=True)
MONO = TTFont(os.path.join(os.path.dirname(__file__), 'fonts', 'JetBrainsMono-Medium.ttf'))

light = B.instance(100, 300)
semi = B.instance(100, 600)
regular = B.instance(100, 420)
word = B.instance(112, 620)
GOLD, NAVY, WHITE = B.GOLD, B.NAVY, B.WHITE


def txt(font, s, size, x, y, fill, tracking=0.0, lam=False, opacity=1):
    d, w, cap = B.text_path(font, s, size, tracking, lambda_a=lam)
    return f'<path fill="{fill}" fill-opacity="{opacity}" transform="translate({x:.1f} {y:.1f})" d="{d}"/>', w


def icon(x, y, h):
    sc = h / B.ICON_BOX[3]
    return B.icon_group(GOLD, x, y, sc), B.ICON_BOX[2] * sc


def lockup(x, y, icon_h, word_size):
    g, iw = icon(x, y, icon_h)
    t, ww = txt(word, 'METATRON SERVICE', word_size, x + iw + icon_h * 0.28, y + icon_h * 0.62, WHITE,
                tracking=word_size * 0.1, lam=True)
    return g + '\n' + t


def render(name, w, h, bg, body, jpg=True):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
           f'width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
           f'<defs>\n'
           f' <linearGradient id="fadeL" x1="0" x2="1" y1="0" y2="0">'
           f'<stop offset="0" stop-color="{NAVY}" stop-opacity=".97"/>'
           f'<stop offset=".45" stop-color="{NAVY}" stop-opacity=".82"/>'
           f'<stop offset=".75" stop-color="{NAVY}" stop-opacity=".15"/>'
           f'<stop offset="1" stop-color="{NAVY}" stop-opacity="0"/></linearGradient>\n'
           f' <linearGradient id="fadeB" x1="0" x2="0" y1="0" y2="1">'
           f'<stop offset="0" stop-color="{NAVY}" stop-opacity=".92"/>'
           f'<stop offset=".30" stop-color="{NAVY}" stop-opacity=".72"/>'
           f'<stop offset=".48" stop-color="{NAVY}" stop-opacity=".1"/>'
           f'<stop offset=".62" stop-color="{NAVY}" stop-opacity=".55"/>'
           f'<stop offset=".78" stop-color="{NAVY}" stop-opacity=".92"/>'
           f'<stop offset="1" stop-color="{NAVY}" stop-opacity=".98"/></linearGradient>\n'
           f'</defs>\n'
           f'<rect width="{w}" height="{h}" fill="{NAVY}"/>\n'
           f'<image href="{os.path.basename(bg)}" x="0" y="0" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice"/>\n'
           f'{body}\n</svg>\n')
    import shutil; shutil.copy(bg, TMP)
    p = os.path.join(TMP, name + '.svg')
    open(p, 'w').write(svg)
    png = os.path.join(TMP, name + '.png')
    subprocess.run(['rsvg-convert', '-w', str(w), '-h', str(h), p, '-o', png], check=True)
    out = os.path.join(OUT, name + '.jpg')
    subprocess.run(['magick', png, '-strip', '-quality', '88', '-sampling-factor', '4:2:0', out], check=True)
    return out


SERV = 'ELÉCTRICA · FOTOVOLTAICA · AIRE ACONDICIONADO · AISLAMIENTO · CIVIL · ESTRUCTURAL'

# ---------- 1200x630 Open Graph
W, H = 1200, 630
b = [f'<rect width="{W}" height="{H}" fill="url(#fadeL)"/>']
b.append(lockup(72, 64, 54, 26))
b.append(f'<rect x="72" y="176" width="44" height="3" fill="{GOLD}"/>')
b.append(txt(MONO, 'OFFSHORE · TERRESTRE · MÉXICO', 15, 132, 183, GOLD, tracking=2.2)[0])
b.append(txt(light, 'Mantenimiento y obras', 64, 70, 280, WHITE, tracking=-1.2)[0])
t, w1 = txt(semi, 'offshore', 64, 70, 358, GOLD, tracking=-1.2)
b.append(t)
b.append(txt(semi, 'y terrestres.', 64, 70 + w1 + 18, 358, WHITE, tracking=-1.2)[0])
b.append(txt(regular, 'Eléctrica, fotovoltaica, aire acondicionado, aislamiento térmico,', 22, 72, 420, WHITE,
             opacity=.78)[0])
b.append(txt(regular, 'obra civil y estructural con estándar industrial.', 22, 72, 450, WHITE, opacity=.78)[0])
b.append(f'<rect x="72" y="520" width="{W - 144}" height="1" fill="{WHITE}" fill-opacity=".18"/>')
b.append(txt(MONO, 'CALIDAD · SEGURIDAD · COMPROMISO', 15, 72, 562, WHITE, tracking=2.2, opacity=.7)[0])
t, pw = txt(MONO, '938 183 8455', 22, 0, 0, GOLD, tracking=1.5)
b.append(t.replace('translate(0.0 0.0)', f'translate({W - 72 - pw:.1f} 566)'))
render('og-image', W, H, f'{IMG}/hero-offshore.jpg', '\n'.join(b))

# ---------- 1200x1200 square
W, H = 1200, 1200
b = [f'<rect width="{W}" height="{H}" fill="url(#fadeB)"/>']
ic, iw = icon(0, 0, 230)
b.append(B.icon_group(GOLD, (W - iw) / 2, 120, 230 / B.ICON_BOX[3]))
t, ww = txt(word, 'METATRON SERVICE', 64, 0, 0, WHITE, tracking=6.4, lam=True)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - ww) / 2:.1f} 430)'))
t, tw = txt(MONO, 'MANTENIMIENTO & OBRAS OFFSHORE / TERRESTRES', 19, 0, 0, GOLD, tracking=2.4)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - tw) / 2:.1f} 478)'))
t, w1 = txt(light, 'Tu proyecto,', 84, 0, 0, WHITE, tracking=-2)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - w1) / 2:.1f} 935)'))
t, w2 = txt(semi, 'nuestra misión.', 84, 0, 0, GOLD, tracking=-2)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - w2) / 2:.1f} 1030)'))
t, w3 = txt(MONO, 'MÉXICO  ·  938 183 8455', 20, 0, 0, WHITE, tracking=2, opacity=.75)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - w3) / 2:.1f} 1110)'))
render('og-square', W, H, f'{IMG}/frame-final.jpg', '\n'.join(b))

# ---------- 1080x1920 story
W, H = 1080, 1920
b = [f'<rect width="{W}" height="{H}" fill="url(#fadeB)"/>']
ic, iw = icon(0, 0, 210)
b.append(B.icon_group(GOLD, (W - iw) / 2, 170, 210 / B.ICON_BOX[3]))
t, ww = txt(word, 'METATRON SERVICE', 60, 0, 0, WHITE, tracking=6, lam=True)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - ww) / 2:.1f} 460)'))
t, tw = txt(MONO, 'MANTENIMIENTO & OBRAS OFFSHORE / TERRESTRES', 17, 0, 0, GOLD, tracking=2.2)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - tw) / 2:.1f} 505)'))
for i, (s, f, c) in enumerate([('Fuerza,', light, WHITE), ('compromiso y', light, WHITE),
                                ('experiencia', semi, GOLD), ('que construye', light, WHITE),
                                ('confianza.', semi, WHITE)]):
    t, lw = txt(f, s, 104, 0, 0, c, tracking=-2.5)
    b.append(t.replace('translate(0.0 0.0)', f'translate({(W - lw) / 2:.1f} {1240 + i * 112})'))
t, w3 = txt(MONO, '938 183 8455  ·  MÉXICO', 22, 0, 0, WHITE, tracking=2, opacity=.8)
b.append(t.replace('translate(0.0 0.0)', f'translate({(W - w3) / 2:.1f} 1840)'))
render('og-story', W, H, f'{IMG}/frame-inicio-movil.jpg', '\n'.join(b))
print('ok')
