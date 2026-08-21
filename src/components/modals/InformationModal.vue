<script>
import InformationModalButton from "@/components/modals/InformationModalButton";
import ModalCloseButton from "@/components/modals/ModalCloseButton";

export default {
  name: "InformationModal",
  components: {
    ModalCloseButton,
    InformationModalButton
  },
  computed: {
    ghRepo() { return i18n("modal", "informationModalGithub"); },
    adserv() { return i18n("modal", "informationModalDiscord"); },
    adgp() { return i18n("modal", "informationModalGooglePlay"); },
    adstm() { return i18n("modal", "informationModalSteam"); },
    cred() { return i18n("modal", "informationModalCredits"); },
    changelog() { return i18n("modal", "informationModalChangelog"); },
    topLabel() { return i18n("modal", "informationModalTitle"); },
    infoText() { return i18n("modal", "informationModalInfoText", [], true); },
  }
};
</script>

<template>
  <div class="l-information-modal c-information-modal">
    <ModalCloseButton @click="emitClose" />
    <div class="l-h2p-header">
      <div class="c-h2p-title">
        {{ topLabel }}
      </div>
    </div>
    <div class="c-info-body">
      {{ infoText[0] }}
      <br>
      <br>
      {{ infoText[1] }}
      <br>
      <br>
      {{ infoText[2] }}
    </div>
    <div class="l-socials">
      <InformationModalButton
        :name="ghRepo"
        icon="fa-brands fa-github"
        link="https://github.com/HexaVault/AD-breaketernity"
      />
      <InformationModalButton
        name="r/AntimatterDimensions"
        icon="fa-brands fa-reddit-alien"
        link="https://www.reddit.com/r/AntimatterDimensions/"
      />
      <InformationModalButton
        :name="adserv"
        icon="fa-brands fa-discord"
        link="https://discord.gg/ST9NaXa"
      />
      <InformationModalButton
        :name="adgp"
        icon="fa-brands fa-google-play"
        link="https://play.google.com/store/apps/details?id=kajfosz.antimatterdimensions"
      />
      <InformationModalButton
        :name="adstm"
        icon="fa-brands fa-steam"
        link="https://store.steampowered.com/app/1399720/Antimatter_Dimensions/"
      />
      <InformationModalButton
        :name="cred"
        icon="fa-solid fa-users"
        show-modal="credits"
      />
      <InformationModalButton
        :name="changelog"
        icon="fa-solid fa-file-lines"
        show-modal="changelog"
      />
    </div>
  </div>
</template>

<style scoped>
.l-information-modal {
  display: flex;
  flex-direction: column;
  /* stylelint-disable-next-line unit-allowed-list */
  width: calc(100vw - 50vh);
  justify-content: space-around;
}

.c-information-modal {
  margin: 0.5rem;
}

.c-info-body {
  text-align: left;
  font-size: 2rem;
  margin: 1rem;
  padding: 0.5rem;
}

.t-s12 .c-info-body {
  font-size: 1.3rem;
  margin: 0;
}

.l-socials {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 7.5rem;
}

.t-s12 .l-socials {
  width: 100%;
  align-self: center;
}
</style>
