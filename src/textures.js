/* 程序化 Canvas 贴图:纸面背景 / 纸桌 / 图纸垫 / C64 蓝色 PCB(丝印+走线) / 芯片顶标 */
(function (C64B) {

  /* 主板元件布局表(板面坐标:米,x 右 / z 前),PCB 贴图与 3D 零件共用 */
  C64B.PCB_LAYOUT = {
    dram: [
      [-1.95, -0.86], [-1.55, -0.86], [-1.95, -0.44], [-1.55, -0.44],
      [-1.95, -0.02], [-1.55, -0.02], [-1.95, 0.4], [-1.55, 0.4]
    ],
    chips: [
      { x: 0.05, z: 0.02, w: 0.16, l: 0.52, ref: "U6", name: "6510" },
      { x: 0.72, z: -0.72, w: 0.16, l: 0.52, ref: "U18", name: "6569" },
      { x: -1.15, z: 0.85, w: 0.16, l: 0.38, ref: "U5", name: "6581" },
      { x: 0.72, z: 0.02, w: 0.16, l: 0.38, ref: "U7", name: "906114" },
      { x: -0.12, z: 0.92, w: 0.16, l: 0.52, ref: "U1", name: "6526" },
      { x: 0.72, z: 0.92, w: 0.16, l: 0.52, ref: "U2", name: "6526" },
      { x: 1.52, z: -0.62, w: 0.17, l: 0.34, ref: "U19", name: "BASIC" },
      { x: 1.52, z: -0.08, w: 0.17, l: 0.34, ref: "U20", name: "KERNAL" },
      { x: 1.52, z: 0.42, w: 0.17, l: 0.34, ref: "U21", name: "CHAR" }
    ],
    edges: [
      { x: 2.2, z: -0.1, w: 0.14, l: 1.2, label: "EXPANSION" },
      { x: -0.35, z: 1.46, w: 0.5, l: 0.13, label: "USER PORT" },
      { x: -1.05, z: 1.46, w: 0.44, l: 0.13, label: "CASSETTE" }
    ],
    dins: [
      { x: -1.95, z: 1.12, r: 0.06 },
      { x: 1.45, z: 1.35, r: 0.065 },
      { x: 1.3, z: -1.18, r: 0.075 }
    ],
    db9s: [[0.2, 1.35], [0.85, 1.35]]
  };

  function makeTex(w, h, draw, opts) {
    opts = opts || {};
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.encoding = THREE.sRGBEncoding;
    if (opts.repeat) {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(opts.repeat[0], opts.repeat[1]);
    }
    return tex;
  }

  /* 米棕纸面背景 */
  function sky() {
    return makeTex(1024, 512, function (ctx, w, h) {
      var g = ctx.createLinearGradient(0, 0, w * 0.3, h);
      g.addColorStop(0, "#e2d6bc");
      g.addColorStop(0.5, "#d8cbb2");
      g.addColorStop(1, "#cfc0a4");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      function blob(x, y, r, c) {
        var rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, c);
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      blob(w * 0.2, h * 0.22, 300, "rgba(169,138,61,0.16)");
      blob(w * 0.78, h * 0.3, 340, "rgba(64,72,168,0.12)");
      blob(w * 0.5, h * 0.78, 320, "rgba(216,203,178,0.5)");
      blob(w * 0.9, h * 0.75, 240, "rgba(169,138,61,0.10)");
    });
  }

  /* 纸桌(米棕,细纤维) */
  function desk() {
    return makeTex(512, 512, function (ctx, w, h) {
      ctx.fillStyle = "#c9bc9f";
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < 520; i++) {
        ctx.fillStyle = "rgba(90,80,60," + (0.02 + Math.random() * 0.05) + ")";
        ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 4, 1);
      }
      for (var s = 0; s < 14; s++) {
        ctx.fillStyle = "rgba(105,95,72," + (0.03 + Math.random() * 0.05) + ")";
        ctx.fillRect(0, Math.random() * h, w, 1 + Math.random() * 3);
      }
    }, { repeat: [7, 7] });
  }

  /* 图纸切割垫(米色纸 + 墨线网格 + 标题栏) */
  function mat() {
    return makeTex(1140, 840, function (ctx, w, h) {
      ctx.fillStyle = "#e6dcc3";
      ctx.fillRect(0, 0, w, h);
      for (var i = 0; i < 700; i++) {
        ctx.fillStyle = "rgba(120,105,80," + (0.02 + Math.random() * 0.04) + ")";
        ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1);
      }
      ctx.strokeStyle = "rgba(42,38,32,0.1)";
      ctx.lineWidth = 1;
      for (var x = 37.5; x < w; x += 75) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (var y = 37.5; y < h; y += 75) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(42,38,32,0.18)";
      ctx.lineWidth = 1.4;
      for (var x2 = 150; x2 < w; x2 += 300) { ctx.beginPath(); ctx.moveTo(x2, 0); ctx.lineTo(x2, h); ctx.stroke(); }
      for (var y2 = 150; y2 < h; y2 += 300) { ctx.beginPath(); ctx.moveTo(0, y2); ctx.lineTo(w, y2); ctx.stroke(); }
      // 双层边框
      ctx.strokeStyle = "rgba(42,38,32,0.55)";
      ctx.lineWidth = 2.5;
      ctx.strokeRect(24, 24, w - 48, h - 48);
      ctx.lineWidth = 1;
      ctx.strokeRect(34, 34, w - 68, h - 68);
      // 四角套准十字(C64 蓝)
      ctx.strokeStyle = "rgba(64,72,168,0.6)";
      ctx.lineWidth = 1.6;
      [[52, 52], [w - 52, 52], [52, h - 52], [w - 52, h - 52]].forEach(function (p) {
        ctx.beginPath();
        ctx.moveTo(p[0] - 10, p[1]); ctx.lineTo(p[0] + 10, p[1]);
        ctx.moveTo(p[0], p[1] - 10); ctx.lineTo(p[0], p[1] + 10);
        ctx.stroke();
      });
      // 标题栏
      ctx.strokeStyle = "rgba(42,38,32,0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(w - 350, h - 122, 320, 94);
      ctx.fillStyle = "rgba(42,38,32,0.72)";
      ctx.font = "bold 22px monospace";
      ctx.fillText("C64 MOTHERBOARD LAB", w - 334, h - 90);
      ctx.font = "14px monospace";
      ctx.fillText("FIG. 03 · ASSY 250425", w - 334, h - 64);
      ctx.fillText("SCALE 1:1 · SHEET 1/1", w - 334, h - 42);
      ctx.font = "14px monospace";
      ctx.fillStyle = "rgba(42,38,32,0.5)";
      ctx.fillText("MOS 6510 · 6569 · 6581 · 6526 ×2 · 4164 ×8", 48, h - 46);
      // 蓝色角块
      ctx.fillStyle = "rgba(64,72,168,0.75)";
      ctx.fillRect(24, 24, 26, 8);
      ctx.fillRect(24, 24, 8, 26);
    });
  }

  /* DIP 丝印框:外框 + 引脚刻线 + pin1 圆点 + 位号 */
  function dipSilk(ctx, cx, cy, wpx, lpx, ref, name) {
    ctx.strokeStyle = "rgba(240,242,255,0.72)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - wpx / 2, cy - lpx / 2, wpx, lpx);
    ctx.fillStyle = "rgba(240,242,255,0.5)";
    var n = Math.floor(lpx / 9);
    for (var i = 0; i < n; i++) {
      var yy = cy - lpx / 2 + 4 + i * 9;
      ctx.fillRect(cx - wpx / 2 - 3, yy, 3, 4);
      ctx.fillRect(cx + wpx / 2, yy, 3, 4);
    }
    ctx.beginPath();
    ctx.arc(cx - wpx / 2 + 6, cy - lpx / 2 + 6, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(240,242,255,0.82)";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "left";
    ctx.fillText(ref + " " + name, cx + wpx / 2 + 6, cy - lpx / 2 + 12);
  }

  /* 弧形丝印文字 */
  function arcText(ctx, text, cx, cy, r, a0, a1, size) {
    ctx.save();
    ctx.fillStyle = "rgba(240,242,255,0.85)";
    ctx.font = "bold " + size + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (var i = 0; i < text.length; i++) {
      var a = a0 + (a1 - a0) * (i + 0.5) / text.length;
      ctx.save();
      ctx.translate(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.rotate(a + Math.PI / 2);
      ctx.fillText(text.charAt(i), 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  /* C64 蓝色 PCB:底色 + 斑驳 + 走线 + 过孔 + 金手指 + 丝印 */
  function c64Pcb() {
    return makeTex(1024, 676, function (ctx, w, h) {
      var L = C64B.PCB_LAYOUT;
      var sx = w / 4.4, sz = h / 2.9;
      function X(x) { return (x + 2.2) * sx; }
      function Z(z) { return (z + 1.45) * sz; }
      ctx.fillStyle = "#4048a8";
      ctx.fillRect(0, 0, w, h);
      // 斑驳底纹
      var seed = 11;
      function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
      for (var i = 0; i < 34; i++) {
        var bx = rnd() * w, by = rnd() * h, br = 30 + rnd() * 90;
        var bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        bg.addColorStop(0, rnd() > 0.5 ? "rgba(24,28,92,0.10)" : "rgba(120,130,220,0.07)");
        bg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bg;
        ctx.fillRect(bx - br, by - br, br * 2, br * 2);
      }
      // 曼哈顿走线
      ctx.strokeStyle = "rgba(24,28,92,0.5)";
      ctx.lineWidth = 2;
      for (var t = 0; t < 42; t++) {
        ctx.beginPath();
        var x = rnd() * w, y = rnd() * h;
        ctx.moveTo(x, y);
        for (var s = 0; s < 4; s++) {
          if (rnd() > 0.5) x += (rnd() - 0.5) * 260; else y += (rnd() - 0.5) * 180;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      // 电源区加粗走线
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(24,28,92,0.4)";
      ctx.beginPath();
      ctx.moveTo(X(-2.1), Z(1.1)); ctx.lineTo(X(-1.2), Z(1.1)); ctx.lineTo(X(-1.2), Z(0.2));
      ctx.stroke();
      // 过孔
      ctx.fillStyle = "rgba(190,196,255,0.26)";
      for (var v = 0; v < 130; v++) {
        ctx.beginPath();
        ctx.arc(rnd() * w, rnd() * h, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      // 金手指条
      L.edges.forEach(function (e) {
        ctx.fillStyle = "rgba(206,176,92,0.9)";
        var ew = e.w * sx, el = e.l * sz;
        ctx.fillRect(X(e.x) - ew / 2, Z(e.z) - el / 2, ew, el);
        ctx.fillStyle = "rgba(64,72,168,0.55)";
        if (el > ew) {
          for (var f = 0; f < Math.floor(el / 9); f++) ctx.fillRect(X(e.x) - ew / 2, Z(e.z) - el / 2 + 2 + f * 9, ew, 3);
        } else {
          for (var f2 = 0; f2 < Math.floor(ew / 9); f2++) ctx.fillRect(X(e.x) - ew / 2 + 2 + f2 * 9, Z(e.z) - el / 2, 3, el);
        }
        ctx.fillStyle = "rgba(240,242,255,0.7)";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(e.label, X(e.x), Z(e.z) + (el > ew ? -el / 2 - 8 : el / 2 + 16));
      });
      // DIN 座圆丝印
      ctx.strokeStyle = "rgba(206,176,92,0.9)";
      ctx.lineWidth = 2.5;
      L.dins.forEach(function (d) {
        ctx.beginPath();
        ctx.arc(X(d.x), Z(d.z), d.r * sx, 0, Math.PI * 2);
        ctx.stroke();
      });
      // DB9 丝印框
      L.db9s.forEach(function (p) {
        ctx.strokeStyle = "rgba(240,242,255,0.7)";
        ctx.lineWidth = 2;
        ctx.strokeRect(X(p[0]) - 20, Z(p[1]) - 15, 40, 30);
      });
      // 芯片丝印
      L.chips.forEach(function (c) { dipSilk(ctx, X(c.x), Z(c.z), c.w * sx, c.l * sz, c.ref, c.name); });
      L.dram.forEach(function (d, i) { dipSilk(ctx, X(d[0]), Z(d[1]), 0.12 * sx, 0.26 * sz, "U" + (9 + i), "4164"); });
      // 接口文字丝印
      ctx.fillStyle = "rgba(240,242,255,0.8)";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "left";
      ctx.fillText("PWR 5V DC", X(-1.95) - 42, Z(1.12) + 30);
      ctx.fillText("JOY 1", X(0.2) - 18, Z(1.35) + 34);
      ctx.fillText("JOY 2", X(0.85) - 18, Z(1.35) + 34);
      ctx.fillText("IEC", X(1.45) - 12, Z(1.35) + 28);
      ctx.fillText("VIDEO·AUDIO", X(1.3) - 44, Z(-1.18) - 14);
      ctx.fillText("RF", X(1.85) - 10, Z(-1.02) - 28);
      // 弧形机名 + 小字
      arcText(ctx, "COMMODORE 64", X(0.35), Z(-1.45) + 610, 545, -2.18, -0.96, 46);
      ctx.fillStyle = "rgba(240,242,255,0.65)";
      ctx.font = "bold 15px monospace";
      ctx.fillText("PERSONAL COMPUTER", X(-1.85), Z(-1.22));
      ctx.font = "bold 16px monospace";
      ctx.fillText("ASSY 250425 · PAL", X(2.1) - 140, Z(1.32));
      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(240,242,255,0.5)";
      ctx.fillText("MOS 6510 · 6569 · 6581 · 6526", X(-2.1), Z(1.38));
    });
  }

  /* 芯片顶面丝印(文字沿板面前后向排布) */
  function chipTop(w, h, title, sub) {
    return makeTex(w, h, function (ctx) {
      ctx.fillStyle = "#15161b";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath();
      ctx.arc(w - 8, 10, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#dcdad2";
      ctx.font = "bold 21px Menlo, Consolas, monospace";
      ctx.fillText(title, 0, sub ? -9 : 0, h - 12);
      if (sub) {
        ctx.fillStyle = "rgba(220,218,210,0.62)";
        ctx.font = "12px Menlo, Consolas, monospace";
        ctx.fillText(sub, 0, 12, h - 14);
      }
      ctx.restore();
      var g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(255,255,255,0.09)");
      g.addColorStop(0.25, "rgba(255,255,255,0.01)");
      g.addColorStop(1, "rgba(0,0,0,0.12)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
  }

  C64B.Textures = {
    sky: sky,
    desk: desk,
    mat: mat,
    c64Pcb: c64Pcb,
    chipTop: chipTop,
    makeTex: makeTex
  };
})(window.C64B = window.C64B || {});
