"""Builds Metatron Service logo SVGs (flat, no shadows) from geometric primitives
and Archivo outlines. Output dir is argv[1]."""
import sys, os, math
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), 'out')
FONT = os.path.join(os.path.dirname(__file__), 'fonts', 'Archivo.ttf')
os.makedirs(OUT, exist_ok=True)

GOLD = '#E3A21A'
NAVY = '#0A1630'
WHITE = '#F7F3EA'


def instance(wdth, wght):
    f = TTFont(FONT)
    return instancer.instantiateVariableFont(f, {'wdth': wdth, 'wght': wght})


def text_path(font, text, size, tracking=0.0, lambda_a=True):
    """Return (d, width, cap_height) for text at given px size; baseline y=0, y down."""
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font['head'].unitsPerEm
    s = size / upm
    cap = font['OS/2'].sCapHeight * s
    x = 0.0
    parts = []
    for ch in text:
        if ch == ' ':
            x += gs[cmap[ord(' ')]].width * s + tracking
            continue
        flip = lambda_a and ch == 'A'
        gname = cmap[ord('V' if flip else ch)]
        g = gs[gname]
        pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        if flip:
            # Mirror V vertically around cap-height midline -> geometric Λ without crossbar
            capu = font['OS/2'].sCapHeight
            t = (s, 0, 0, s, x, -cap)  # y-up glyph scaled; vertical flip applied below
            tp = TransformPen(pen, (s, 0, 0, s, x, -cap))
        else:
            tp = TransformPen(pen, (s, 0, 0, -s, x, 0))
        g.draw(tp)
        parts.append(pen.getCommands())
        x += g.width * s + tracking
    width = x - tracking
    return ' '.join(parts), width, cap


# ---------------------------------------------------------------- icon
# Coordinates follow the brand poster artwork; viewBox below crops to bounds.
def icon_shapes(c):
    r = []
    R = lambda x, y, w, h: r.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}"/>')
    # Antenna mast (木)
    R(489, 40, 9, 62)
    R(472, 58, 43, 8)
    r.append('<path d="M489 70 L467 100 L478 100 L493 79 L508 100 L519 100 L498 70 Z"/>')
    # Tank: dome + two bands
    r.append('<path d="M462 133 A31 22 0 0 1 524 133 Z"/>')
    R(462, 140, 62, 14)
    R(462, 161, 62, 14)
    # Valve cross (‡)
    R(546, 128, 9, 62)
    R(534, 145, 33, 8)
    R(534, 162, 33, 8)
    # Derrick: frame with truss
    r.append('<path fill-rule="evenodd" d="M595 30 H636 V190 H595 Z M604 42 V180 H627 V42 Z"/>')
    r.append('<path fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="miter" '
             'd="M604 42 L627 65 L604 88 L627 111 L604 134 L627 157 L604 180"/>')
    R(642, 44, 11, 146)
    # Crane boom: parallelogram lattice
    r.append('<path fill-rule="evenodd" d="M672 190 L752 38 L822 38 L742 190 Z '
             'M686 181 L736 181 L806 47 L756 47 Z"/>')
    pts = []
    n = 6
    for i in range(n + 1):
        t = i / n
        if i % 2 == 0:
            pts.append((686 + 70 * t, 181 - 134 * t))
        else:
            pts.append((736 + 70 * t, 181 - 134 * t))
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    r.append(f'<path fill="none" stroke="currentColor" stroke-width="6" stroke-linejoin="round" d="{d}"/>')
    R(748, 26, 76, 8)
    # Upper deck
    R(440, 198, 386, 11)
    # Left module: hatched rail row
    r.append('<path fill-rule="evenodd" d="M455 216 H640 V250 H455 Z M462 223 V243 H633 V223 Z"/>')
    hatch = []
    for i in range(8):
        x0 = 468 + i * 21
        hatch.append(f'M{x0} 243 L{x0 + 10} 223 L{x0 + 17} 223 L{x0 + 7} 243 Z')
    r.append(f'<path d="{" ".join(hatch)}"/>')
    # Left module: block with two doors + three posts
    r.append('<path fill-rule="evenodd" d="M455 256 H586 V290 H455 Z M477 268 V290 H497 V268 Z '
             'M540 268 V290 H560 V268 Z"/>')
    R(596, 258, 8, 32)
    R(611, 258, 8, 32)
    R(626, 258, 8, 32)
    # Right module: building with three window slots
    r.append('<path fill-rule="evenodd" d="M652 216 H734 V290 H652 Z M662 224 V248 H676 V224 Z '
             'M686 224 V248 H700 V224 Z M710 224 V248 H724 V224 Z M680 266 V290 H706 V266 Z"/>')
    # Right module: 3x3 grid + side post
    for gy in (220, 244, 268):
        for gx in (744, 763, 782):
            R(gx, gy, 12, 14)
    R(803, 216, 9, 74)
    # Main deck
    R(434, 296, 394, 12)
    # Pontoons (two-tier hulls)
    for px in (474, 704):
        r.append(f'<path d="M{px} 316 H{px + 84} L{px + 72} 342 H{px + 12} Z"/>')
        R(px + 18, 348, 48, 7)
    # Wave
    r.append('<path fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" '
             'd="M432 378 C452 364 472 364 492 378 S532 392 552 378 S592 364 612 378 '
             'S652 392 672 378 S712 364 732 378 S772 392 792 378 S812 364 828 372"/>')
    return '\n    '.join(r)


ICON_BOX = (424, 22, 412, 372)  # x, y, w, h


def svg(w, h, body, title, vb=None):
    vb = vb or f'0 0 {w:.2f} {h:.2f}'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w:.0f}" height="{h:.0f}" '
            f'role="img" aria-labelledby="t">\n  <title id="t">{title}</title>\n{body}\n</svg>\n')


def icon_group(color, x, y, scale):
    ix, iy, _, _ = ICON_BOX
    return (f'  <g fill="{color}" color="{color}" transform="translate({x:.2f} {y:.2f}) scale({scale:.4f}) '
            f'translate({-ix} {-iy})">\n    {icon_shapes(color)}\n  </g>')


def main():
    word_font = instance(112, 620)
    tag_font = instance(108, 560)

    wd, ww, wcap = text_path(word_font, 'METATRON SERVICE', 100, tracking=10)
    td, tw, tcap = text_path(tag_font, 'MANTENIMIENTO & OBRAS OFFSHORE / TERRESTRES', 31, tracking=4.0,
                             lambda_a=False)
    ix, iy, iw, ih = ICON_BOX

    # --- Stacked lockup (primary)
    def stacked(icon_c, word_c, tag_c, name, bg=None):
        W = ww + 40
        icon_h = 400
        sc = icon_h / ih
        icon_w = iw * sc
        y0 = 20
        body = []
        if bg:
            body.append(f'  <rect width="100%" height="100%" fill="{bg}"/>')
        body.append(icon_group(icon_c, (W - icon_w) / 2, y0, sc))
        wy = y0 + icon_h + 46 + wcap
        body.append(f'  <path fill="{word_c}" transform="translate(20 {wy:.2f})" d="{wd}"/>')
        ty = wy + 34 + tcap
        line_gap = 22
        line_len = (W - 40 - tw) / 2 - line_gap
        tx = (W - tw) / 2
        if line_len > 12:
            ly = ty - tcap / 2 - 1.5
            body.append(f'  <rect fill="{tag_c}" x="20" y="{ly:.2f}" width="{line_len:.2f}" height="3"/>')
            body.append(f'  <rect fill="{tag_c}" x="{W - 20 - line_len:.2f}" y="{ly:.2f}" '
                        f'width="{line_len:.2f}" height="3"/>')
        body.append(f'  <path fill="{tag_c}" transform="translate({tx:.2f} {ty:.2f})" d="{td}"/>')
        H = ty + 24
        open(os.path.join(OUT, name), 'w').write(svg(W, H, '\n'.join(body), 'Metatron Service'))

    stacked(GOLD, GOLD, WHITE, 'logo-stacked-dark.svg')     # for dark backgrounds
    stacked(GOLD, NAVY, NAVY, 'logo-stacked-light.svg')     # for light backgrounds
    stacked(GOLD, GOLD, WHITE, 'logo-stacked-navy-bg.svg', bg=NAVY)

    # --- Horizontal lockup (nav)
    def horizontal(icon_c, word_c, tag_c, name):
        icon_h = 140
        sc = icon_h / ih
        icon_w = iw * sc
        gap = 36
        word_scale = 0.62
        tag_scale = 1.0
        text_w = max(ww * word_scale, tw * 0.62)
        W = icon_w + gap + text_w + 14
        H = icon_h + 4
        body = [icon_group(icon_c, 0, 2, sc)]
        tx = icon_w + gap
        wy = 2 + icon_h * 0.52
        body.append(f'  <path fill="{word_c}" transform="translate({tx:.2f} {wy:.2f}) scale({word_scale})" d="{wd}"/>')
        tsc = (ww * word_scale) / tw
        ty = wy + 22 + tcap * tsc
        body.append(f'  <path fill="{tag_c}" transform="translate({tx:.2f} {ty:.2f}) scale({tsc:.4f})" d="{td}"/>')
        open(os.path.join(OUT, name), 'w').write(svg(W, H, '\n'.join(body), 'Metatron Service'))

    horizontal(GOLD, WHITE, GOLD, 'logo-horizontal-dark.svg')
    horizontal(GOLD, NAVY, NAVY, 'logo-horizontal-light.svg')

    # --- Icon only
    pad = 0
    open(os.path.join(OUT, 'logo-icon.svg'), 'w').write(
        svg(iw, ih, icon_group(GOLD, 0, 0, 1), 'Metatron Service'))
    open(os.path.join(OUT, 'logo-icon-currentcolor.svg'), 'w').write(
        svg(iw, ih, icon_group('currentColor', 0, 0, 1), 'Metatron Service'))

    # --- Favicon: icon on navy rounded square
    S = 512
    sc = (S * 0.70) / iw
    body = (f'  <rect width="{S}" height="{S}" rx="104" fill="{NAVY}"/>\n' +
            icon_group(GOLD, (S - iw * sc) / 2, (S - ih * sc) / 2 + 6, sc))
    open(os.path.join(OUT, 'favicon.svg'), 'w').write(svg(S, S, body, 'Metatron Service'))

    # Wordmark-only paths for inline use
    open(os.path.join(OUT, 'wordmark.svg'), 'w').write(
        svg(ww, wcap + 2, f'  <path fill="currentColor" transform="translate(0 {wcap:.2f})" d="{wd}"/>',
            'Metatron Service'))
    print('wordmark', round(ww, 1), 'cap', round(wcap, 1), 'tag', round(tw, 1))


if __name__ == "__main__":
    main()
