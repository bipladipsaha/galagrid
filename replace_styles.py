import os

replacements = [
    ('text-white', 'text-[var(--gaia-text-primary)]'),
    ('bg-[rgba(0,0,0,0.4)]', 'bg-white/50'),
    ('bg-[rgba(0,0,0,0.3)]', 'bg-white/50'),
    ('bg-[rgba(0,0,0,0.2)]', 'bg-white/30'),
    ('bg-[rgba(0,0,0,0.8)]', 'bg-white/90'),
    ('bg-[#020604]', 'bg-[var(--gaia-bg-primary)]'),
    ('bg-[#000000]', 'bg-[var(--gaia-bg-primary)]'),
    ('border-[rgba(255,255,255,0.1)]', 'border-[var(--gaia-border-glass)]'),
    ('border-[rgba(255,255,255,0.05)]', 'border-[var(--gaia-border-glass)]'),
    ('border-[rgba(255,255,255,0.02)]', 'border-[var(--gaia-border-glass)]'),
    ('bg-[rgba(255,255,255,0.1)]', 'bg-black/10'),
    ('bg-[rgba(255,255,255,0.05)]', 'bg-black/5'),
    ('bg-[rgba(255,255,255,0.03)]', 'bg-black/5'),
    ('bg-[rgba(255,255,255,0.02)]', 'bg-black/5'),
    ('hover:bg-[rgba(255,255,255,0.05)]', 'hover:bg-black/5'),
    ('hover:bg-[rgba(255,255,255,0.02)]', 'hover:bg-black/5'),
    ('hover:border-[rgba(255,255,255,0.2)]', 'hover:border-[var(--gaia-green-200)]'),
    ('text-[rgba(255,255,255,0.5)]', 'text-[var(--gaia-text-muted)]'),
    ('fill="#ffffff"', 'fill="var(--gaia-text-primary)"'),
    ('fill="#fff"', 'fill="var(--gaia-text-primary)"'),
    ('stopColor="#ffffff"', 'stopColor="var(--gaia-green-800)"'),
    ('stopColor="#fff"', 'stopColor="var(--gaia-green-800)"'),
    ('stroke="rgba(255,255,255,0.1)"', 'stroke="var(--gaia-border-glass)"'),
    ('text-shadow-[0_0_20px_rgba(255,255,255,0.2)]', ''),
    ('text-shadow-[0_0_10px_rgba(255,255,255,0.5)]', ''),
    ('shadow-[0_0_50px_rgba(0,0,0,0.8)]', 'shadow-2xl'),
    ('shadow-[0_0_20px_rgba(0,0,0,0.5)]', 'shadow-md'),
    ('shadow-[0_20px_40px_rgba(0,0,0,0.4)]', 'shadow-lg'),
    ('shadow-[0_0_30px_rgba(0,0,0,0.8)]', 'shadow-xl'),
    ('bg-black/40', 'bg-white/60'),
    ('bg-black/80', 'bg-white/90'),
    ('bg-black/50', 'bg-white/70'),
    ('text-neon-strong', 'text-[var(--gaia-green-800)] font-bold'),
]

files = []
for root, _, filenames in os.walk('src'):
    for filename in filenames:
        if filename.endswith('.tsx'):
            files.append(os.path.join(root, filename))

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')
