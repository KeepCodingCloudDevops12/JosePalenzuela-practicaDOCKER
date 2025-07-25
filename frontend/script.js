// frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
    const contadorSpan = document.getElementById('contador');
    const resetButton = document.getElementById('resetButton');

    // Función para incrementar el contador (llamando al nuevo endpoint de Flask)
    async function incrementContador() {
        try {
            // Ahora llama a /api/increment en lugar de '/'
            const response = await fetch('/api/increment');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // Esperamos un JSON como respuesta
            console.log('Visitas incrementadas:', data.visitas_incrementadas);
        } catch (error) {
            console.error('Error al incrementar el contador en la carga:', error);
        }
    }

    // Función para obtener y mostrar el contador
    async function getContador() {
        try {
            // Nginx proxyeará '/api/contador' a Flask.
            const response = await fetch('/api/contador');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            contadorSpan.textContent = data.visitas;
        } catch (error) {
            console.error('Error al obtener el contador:', error);
            contadorSpan.textContent = 'Error al cargar';
        }
    }

    // Función para reiniciar el contador
    async function resetContador() {
        if (confirm('¿Estás seguro de que quieres reiniciar el contador?')) {
            try {
                // Nginx proxyeará '/api/reset' a Flask (que en Flask es '/reset').
                const response = await fetch('/api/reset');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text(); // La respuesta de /reset es texto
                alert(text); // Mostrar el mensaje de confirmación
                getContador(); // Actualizar el contador después de reiniciar
            } catch (error) {
                console.error('Error al reiniciar el contador:', error);
                alert('Error al reiniciar el contador.');
            }
        }
    }

    // AL CARGAR LA PÁGINA:
    // 1. Incrementar el contador en el backend (llamando al nuevo endpoint /api/increment)
    incrementContador().then(() => {
        // 2. Luego, obtener y mostrar el contador actualizado
        getContador();
    });

    // Añadir listener al botón de reset
    resetButton.addEventListener('click', resetContador);
});