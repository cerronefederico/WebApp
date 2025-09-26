<script setup lang="ts">
import LoginText from "@/components/loginText.vue";
</script>

<template>
  <div class="container-fluid vh-100 d-flex justify-content-center align-items-center"
       style="background-color: #F8F8F8; padding: 0;">

    <div class="shadow-lg overflow-hidden"
         style="width: 1200px; height: 750px; background-color: #FFFFFF; border-radius: 10px;">

        <div class="row w-100 h-100 g-0 justify-content-evenly">

            <div class="col-md-7 d-none d-md-block">

                <div id="carouselExampleAutoplaying"
                     class="carousel slide h-100"
                     data-bs-ride="carousel"
                     data-bs-interval="5000">

                    <div class="carousel-inner h-100">

                        <div class="carousel-item h-100 active">
                            <img src="/img/immagine prova 1.jpg"
                                 class="d-block w-100 h-100 object-fit-cover"
                                 alt="Macchinario PLC 1">
                            <div class="carousel-caption d-none d-md-block position-absolute w-100 h-100 top-0 start-0"
                                 style="background-color: rgba(0, 0, 0, 0.3);">
                                <h3 style="position: absolute; bottom: 20px; left: 40px; color: #FFFFFF; text-shadow: 1px 1px 2px #000;">
                                    Monitoraggio e Controllo di Precisione
                                </h3>
                            </div>
                        </div>

                        <div class="carousel-item h-100">
                            <img src="/img/immagine prova 2.jpg"
                                 class="d-block w-100 h-100 object-fit-cover"
                                 alt="Macchinario PLC 2">
                            <div class="carousel-caption d-none d-md-block position-absolute w-100 h-100 top-0 start-0"
                                 style="background-color: rgba(0, 0, 0, 0.3);">
                                <h3 style="position: absolute; bottom: 20px; left: 40px; color: #FFFFFF; text-shadow: 1px 1px 2px #000;">
                                    Dati in tempo reale
                                </h3>
                            </div>
                        </div>

                        <div class="carousel-item h-100">
                            <img src="/img/immagine prova 3.jpg"
                                 class="d-block w-100 h-100 object-fit-cover"
                                 alt="Macchinario PLC 3">
                            <div class="carousel-caption d-none d-md-block position-absolute w-100 h-100 top-0 start-0"
                                 style="background-color: rgba(0, 0, 0, 0.3);">
                                <h3 style="position: absolute; bottom: 20px; left: 40px; color: #FFFFFF; text-shadow: 1px 1px 2px #000;">
                                    Affidabilità Industriale
                                </h3>
                            </div>
                        </div>

                        <div class="carousel-item h-100">
                            <img src="/img/immagine prova 4.jpg"
                                 class="d-block w-100 h-100 object-fit-cover"
                                 alt="Macchinario PLC 4">
                            <div class="carousel-caption d-none d-md-block position-absolute w-100 h-100 top-0 start-0"
                                 style="background-color: rgba(0, 0, 0, 0.3);">
                                <h3 style="position: absolute; bottom: 20px; left: 40px; color: #FFFFFF; text-shadow: 1px 1px 2px #000;">
                                    Tecnologia all'Avanguardia
                                </h3>
                            </div>
                        </div>

                    </div>

                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div class="col-md-5 d-flex justify-content-center align-items-center">
                <login-text></login-text>
            </div>

        </div>
    </div>
  </div>
</template>


<script>

</script>