<!-- src/components/Salchimonster.vue -->
<template>
    <img style="width: 100%; position: fixed;left: -10%; top: 0;width: 120vw;height: 100vh;object-fit: cover;z-index: -1;filter: blur(10px);"
        :src="currentPlayback?.currentSong?.thumbnail" alt="">

    <div class="main-container">



        <div class="salchimonster-container" style="overflow: hidden;">
            <Tag severity="danger" style="color: black !important;font-size: 1.2rem;margin: 1rem 0;">Proximamente</Tag>
            <h2 style="margin:0 2rem 0 1rem;">
                <i class="fa-solid fa-play" style="margin-right: 1rem;"></i> SONANDO EN <span
                    style="min-width: max-content;max-width: max-content;">SM {{ siteStore?.sonando?.site_name }}</span>
            </h2>

            <div style="display: flex;gap: 1rem;justify-content: center;">
                <Button size="small" @click="dialogPedirTema = true" style="margin: 1rem 0;" label="Pedir tema"
                    icon="fa-solid fa-forward"></Button>

                <Button size="small" icon="fa-solid fa-sync" @click="siteStore.visibles.sonandoCurrentSite = true"
                    style="margin: 1rem 0;" label="Cambiar sede"></Button>
            </div>


            <!-- Sección del Reproductor de YouTube -->
            <div class="player-wrapper" style="pointer-events: none;">
                <div ref="playerElement" style="width: 100% !important; max-width: 100% !important;"
                    id="youtube-player"></div>
            </div>

            <!-- Información de la Canción Actual -->
            <div v-if="currentPlayback?.currentSong" class="current-song-info">
                <h2>{{ currentPlayback.currentSong.title }}</h2>
                <p><strong>Solicitada por:</strong> {{ currentPlayback.currentSong.requestedBy }}</p>
            </div>

            <div class="progress-bar-container">
                <ProgressBar :value="progressValue" :show-value="false" style="width: 100%;" />
            </div>

            <div class="controls-container">
                <Button disabled rounded icon="fa-solid fa-backward" class="previous-button" />

                <Button v-if="!isLocalPaused" rounded icon="fa-solid fa-pause" @click="pausePlayback" label="Pausa" />
                <Button v-else rounded icon="fa-solid fa-play" @click="resumePlayback" label="Reanudar" />

                <Button disabled rounded icon="fa-solid fa-forward" @click="advanceToNextSong" class="next-button" />
            </div>

            <div class="queue-container">
                <h3>Cola de Reproducción</h3>
                <ul class="queue-list">
                    <li v-for="(song, index) in displayedQueue" :key="`${song.id}-${index}`"
                        :class="{ 'current-song': (startIndex + index) === currentPlayback?.currentIndex }"
                        :style="{ opacity: getOpacity(index), transition: 'opacity 0.5s ease' }">
                        <img :src="song.thumbnail" alt="Thumbnail" class="thumbnail" />
                        <div class="song-info">
                            <span class="song-title">{{ song.title }}</span>
                            <span class="requested-by">Solicitada por: {{ song.requestedBy }}</span>
                        </div>
                    </li>
                </ul>
            </div>

        </div>

    </div>

    <!-- Primer Diálogo: Seleccionar una Canción -->
    <Dialog v-model:visible="dialogPedirTema" modal style="max-width: 94%;width: 40rem; border: none;">
        <template #header>
            <h2 style="color: black;">Solicitar una Canción</h2>
        </template>

        <ul class="queue-list">
            <li class="song" style="transition: all none;" v-random-hover-color="{ opacity: 0.239 }"
                v-for="(song, index) in availableSongs" :key="`${song.id}-${index}`"
                :class="{ 'selected-song': selectedAvailableSong === song }" @click="selectedAvailableSong = song">
                <img :src="song.thumbnail" alt="Thumbnail" class="thumbnail" />
                <div class="song-info">
                    <span style="color: black !important;">{{ song.title }}</span>
                </div>
            </li>
        </ul>

        <template #footer>
            <div class="dialog-footer">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="dialogPedirTema = false" />
                <Button label="Solicitar" icon="pi pi-check" :disabled="!selectedAvailableSong"
                    @click="openSolicitarNombreDialog" class="p-button" />
            </div>
        </template>
    </Dialog>


    <!-- Segundo Diálogo: Ingresar Nombre -->
    <Dialog v-model:visible="dialogSolicitarNombre" modal style="max-width: 94%;width: 30rem;">
        <template #header>
            <h2 style="color: black;">Proporciona tu Nombre</h2>
        </template>

        <div class="solicitar-nombre-container">
            <h3 style="color: black !important;">{{ selectedAvailableSong?.title }}</h3>
            <img :src="selectedAvailableSong?.thumbnail" alt="Thumbnail" class="thumbnail-large" />
            <InputText style="width: 100%;color: black;" v-model="requesterName" placeholder="Tu nombre"
                class="input-text" />
        </div>

        <template #footer>
            <div class="dialog-footer">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text"
                    @click="dialogSolicitarNombre = false" />
                <Button label="Solicitar" icon="pi pi-check" :disabled="!requesterName.trim()"
                    @click="handleAddSongWithName" />
            </div>
        </template>
    </Dialog>

    <siteDialogSonando></siteDialogSonando>

</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue'
import axios from 'axios'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Dialog } from 'primevue'
import { useSitesStore } from '@/store/site'
import siteDialogSonando from '@/components/Dialogs/siteDialogSonando.vue'
import { Tag } from 'primevue'

// =======================================================================
// NOTA: Ajusta estas URLs según tu configuración de backend y dominio.
// =======================================================================
const API_BASE = 'https://backend-musica.salchimonster.com' // o tu URL real (por ej. 'https://backend-musica.salchimonster.com')
const WS_BASE = 'wss://backend-musica.salchimonster.com/ws' // o 'wss://backend-musica.salchimonster.com/ws' en producción
// =======================================================================

// Store de sitios (sedes)
const siteStore = useSitesStore()

// Diálogos
const dialogPedirTema = ref(false)
const dialogSolicitarNombre = ref(false)

// Control local del reproductor
const isLocalPaused = ref(true)
function pausePlayback() {
    if (player && playerState.isPlayerReady) {
        player.pauseVideo()
        isLocalPaused.value = true
    }
}
function resumePlayback() {
    if (player && playerState.isPlayerReady) {
        player.seekTo(currentPlayback.value.currentTime, true)
        player.playVideo()
        isLocalPaused.value = false
    }
}

// Canción seleccionada
const selectedAvailableSong = ref(null)
const requesterName = ref('')

// Función para abrir el segundo diálogo (nombre)
function openSolicitarNombreDialog() {
    if (selectedAvailableSong.value) {
        dialogSolicitarNombre.value = true
    } else {
        alert('Por favor, selecciona una canción primero.')
    }
}

// Función para manejar la solicitud de la canción con nombre
async function handleAddSongWithName() {
    if (!selectedAvailableSong.value || !requesterName.value.trim()) {
        alert('Por favor, selecciona una canción y proporciona tu nombre.')
        return
    }
    try {
        const message = {
            type: 'add_song',
            song_id: selectedAvailableSong.value.id,
            requestedBy: requesterName.value.trim()
        }
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message))
            // Limpiar campos y cerrar diálogos
            selectedAvailableSong.value = null
            requesterName.value = ''
            dialogSolicitarNombre.value = false
            dialogPedirTema.value = false
        } else {
            alert('No estás conectado al servidor. Intenta recargar la página.')
        }
    } catch (error) {
        console.error('Error al agregar la canción a la cola:', error)
    }
}

// Reproductor de YouTube
const playerElement = ref(null)
let player = null

// Estado de reproducción compartido (vía WebSocket)
const currentPlayback = ref(null)

// Cola de reproducción
const videoQueue = ref([])

// Biblioteca global de canciones
const availableSongs = ref([])

// Tiempo y duración (para la barra de progreso)
const currentTime = ref(0)
const totalDuration = ref(0)

// Estado adicional del reproductor
const playerState = reactive({
    isPlayerReady: false,
    showPlayButton: false
})

// Computed para formatear el tiempo
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
const formattedCurrentTime = computed(() => formatTime(currentTime.value))
const formattedTotalDuration = computed(() => formatTime(totalDuration.value))

// Barra de progreso
const progressValue = computed(() => {
    if (totalDuration.value > 0) {
        return (currentTime.value / totalDuration.value) * 100
    }
    return 0
})

// Índice de cola para mostrar últimas canciones
const startIndex = computed(() => {
    if (!currentPlayback.value || currentPlayback.value.currentIndex === undefined) return 0
    return Math.max(currentPlayback.value.currentIndex - 4, 0)
})
const displayedQueue = computed(() => videoQueue.value.slice(startIndex.value))

// Manejo de IDs de sede
const sedeID = computed(() => siteStore.sonando?.site_id || 'default')
// ^ Ajusta "default" según tu preferencia si no hay sede seleccionada.

// Socket WebSocket
let socket = null
let lastLoadedSongId = ref(null)

// Función para (re)conectarse al WebSocket
function connectWebSocket() {
    // Cierra cualquier socket abierto
    if (socket) {
        socket.close()
        socket = null
    }
    // Construye la URL con la sede
    const wsUrl = `${WS_BASE}/${sedeID.value}`
    socket = new WebSocket(wsUrl)

    socket.onopen = () => {
        console.log(`Conectado al WebSocket de la sede: ${sedeID.value}`)
    }

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'queue_update') {
                videoQueue.value = data.queue;
                currentPlayback.value = data.status;

                currentTime.value = data.status.currentTime;
                totalDuration.value = data.status.totalDuration;

                const currentSongId = data.status.currentSong ? data.status.currentSong.id : null;
                if (currentSongId !== lastLoadedSongId.value) {
                    loadCurrentSong(currentSongId);
                    lastLoadedSongId.value = currentSongId;
                }
                // Si isPlaying es false, mostramos el botón "Play"
                playerState.showPlayButton = !data.status.isPlaying;
            }
        } catch (error) {
            console.error('Error al parsear mensaje del WebSocket:', error);
        }
    }

    socket.onerror = (error) => {
        console.error('Error en el WebSocket:', error)
    }

    socket.onclose = () => {
        console.warn(`WebSocket cerrado para sede: ${sedeID.value}. Reintentando en 3 segundos...`)
        setTimeout(() => {
            connectWebSocket()
        }, 3000)
    }
}

// Funciones para YouTube Player
function loadYouTubeAPI(onAPIReady) {
    if (window.YT && window.YT.Player) {
        onAPIReady()
        return
    }
    window.onYouTubeIframeAPIReady = () => {
        onAPIReady()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
}

function createYouTubePlayer(element, videoId, onReady, onStateChange) {
    return new window.YT.Player(element, {
        videoId,
        playerVars: {
            autoplay: 1,
            controls: 1,
            disablekb: 0,
            fs: 1,
            playsinline: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
        },
        events: {
            onReady,
            onStateChange,
        },
    })
}

function onPlayerReady(event) {
    playerState.isPlayerReady = true;
    if (currentPlayback.value?.isPlaying) {
        // Reproducir el video
        event.target.playVideo()
        if (currentTime.value > 0) {
            event.target.seekTo(currentTime.value, true)
        }
    } else {
        event.target.pauseVideo()
        playerState.showPlayButton = true
    }
}

function onPlayerStateChange(event) {
    const PlayerState = window.YT.PlayerState
    switch (event.data) {
        case PlayerState.PLAYING:
            break
        case PlayerState.PAUSED:
            break
        case PlayerState.ENDED:
            advanceToNextSong()
            break
        default:
            break
    }
}

// Cargar la canción actual en el reproductor
function loadCurrentSong(songId) {
    if (window.YT && window.YT.Player && songId) {
        if (!player) {
            player = createYouTubePlayer(playerElement.value, songId, onPlayerReady, onPlayerStateChange);
        } else {
            player.loadVideoById({
                videoId: songId,
                startSeconds: currentTime.value
            });
            if (currentPlayback.value.isPlaying) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        }
    }
}

// Avanzar a la siguiente canción
async function advanceToNextSong() {
    try {
        // Se hace vía REST con la sede
        await axios.post(`${API_BASE}/next/${sedeID.value}`)
        // El backend emitirá la actualización vía WebSocket
    } catch (error) {
        console.error('Error al avanzar a la siguiente canción:', error)
    }
}

// Cargar datos iniciales de la sede
async function loadInitialData() {
    try {
        // Se llaman los endpoints correspondientes a la sede
        const [availableResp, queueResp, currentResp] = await Promise.all([
            axios.get(`${API_BASE}/available`),            // Biblioteca compartida (sin sede)
            axios.get(`${API_BASE}/queue/${sedeID.value}`),   // Cola de la sede
            axios.get(`${API_BASE}/current/${sedeID.value}`), // Estado actual de la sede
        ])

        availableSongs.value = availableResp.data
        videoQueue.value = queueResp.data
        currentPlayback.value = currentResp.data

        currentTime.value = currentPlayback.value.currentTime
        totalDuration.value = currentPlayback.value.totalDuration

        lastLoadedSongId.value = currentPlayback.value.currentSong
            ? currentPlayback.value.currentSong.id
            : null

        // Cargar la canción actual en el reproductor
        loadCurrentSong(lastLoadedSongId.value)
    } catch (error) {
        console.error('Error al cargar datos iniciales:', error)
    }
}

// Función auxiliar para la opacidad de cada elemento de la cola
function getOpacity(index) {
    const total = displayedQueue.value.length
    if (total === 1) return 1
    const minOpacity = 0.2
    const maxOpacity = 1
    const opacityRange = maxOpacity - minOpacity
    const opacity = minOpacity + (index / (total - 1)) * opacityRange
    return opacity
}

// Efectos de ciclo de vida
onMounted(() => {
    // Carga la API de YouTube
    loadYouTubeAPI(() => {
        const videoId = currentPlayback.value?.currentSong?.id || ''
        if (videoId) {
            player = createYouTubePlayer(playerElement.value, videoId, onPlayerReady, onPlayerStateChange)
        }
    })

    // Observamos la sedeID para recargar datos y WebSocket cuando cambie
    watch(sedeID, async (newVal, oldVal) => {
        console.log(`Cambio de sede: ${oldVal} -> ${newVal}`)
        // Cargar datos iniciales de la nueva sede
        await loadInitialData()
        // Reconectar al WebSocket para la nueva sede
        connectWebSocket()
    }, { immediate: true })
})

onUnmounted(() => {
    if (socket) {
        socket.close()
    }
})

</script>

<style scoped>
.salchimonster-container {
    max-width: 640px;
    margin: auto;
    padding: 20px;
    text-align: center;
}

* {
    color: white;
}

.player-wrapper {
    position: relative;
    width: 100%;
}

#youtube-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.current-song-info {
    margin-top: 20px;
}

.progress-bar-container {
    display: flex;
    align-items: center;
    margin-top: 10px;
}

.progress-bar-container span {
    margin-left: 10px;
}

.queue-container {
    margin-top: 30px;
    text-align: left;
}

span {
    color: white !important;
}

.queue-list {
    list-style: none;
    padding: 0;
}

.queue-list li.selected-song {
    background-color: rgba(255, 166, 0, 0.239);
    color: white !important;
    font-weight: bold;
}

.queue-list li {
    cursor: pointer;
    transition: opacity 0.5s ease, background-color 0.3s ease;
    display: flex;
    align-items: center;
    padding: 10px;
}

.song:hover {
    background-color: rgba(0, 3, 182, 0.239);
}

.controls-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
    position: sticky;
    top: 0;
}

.queue-list li.current-song {
    background-color: var(--p-primary-color);
}

.thumbnail {
    width: 80px;
    height: 60px;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 4px;
}

.main-container {
    background-color: rgba(0, 0, 0, 0.591);
    min-height: 120vh;
}

.song-info {
    display: flex;
    flex-direction: column;
}

.song-title {
    font-weight: bold;
}

.requested-by {
    font-size: 0.9em;
    color: #555;
}

.add-song-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.add-song-container .dropdown,
.add-song-container .input-text {
    width: 100%;
    max-width: 300px;
    margin-bottom: 15px;
}

.add-button {
    width: 150px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    width: 100%;
}

.dialog-footer .p-button {
    min-width: 120px;
}

.thumbnail-large {
    width: 100%;
    max-width: 300px;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
}

.solicitar-nombre-container {
    display: flex;
    flex-direction: column;
    color: red;
    align-items: center;
    gap: 1rem;
}

@media (max-width: 600px) {

    .add-song-container,
    .solicitar-nombre-container {
        padding: 0 1rem;
    }
}
</style>
