export const fireVertexShader = `
    varying vec2 vUv;
    varying float vTimeOffset;
    
    uniform float time;

    void main() {
        vUv = uv;

        // Légère ondulation des sommets pour donner vie au feu
        vec3 pos = position;
        pos.y += sin(pos.x * 10.0 + time) * 0.1;
        pos.x += sin(pos.y * 10.0 + time) * 0.05;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`

export const fireFragmentShader = `
varying vec2 vUv;

uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

// Fonction de bruit : pseudo-perlin pour animer les flammes
float noise(vec2 p) {
    return sin(p.x) * sin(p.y);
}

void main() {
    vec2 uv = vUv;

    // Animation du bruit (feu dynamique)
    float n = noise(uv * 10.0 + vec2(time * 0.5, time * 0.3));
    n += noise(uv * 20.0 - vec2(time * 0.1, time * 0.2)) * 0.5;

    // Gradient de couleurs pour le feu
    vec3 color = mix(color1, color2, uv.y);
    color = mix(color, color3, n);

    gl_FragColor = vec4(color, 1.0);
}
`