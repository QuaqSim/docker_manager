import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import I18n from "I18n";

export default class RepoStatus extends Component {
  @service router;
  @service upgradeStore;

  get upgradeDisabled() {
    // Allow to see the currently running upgrade
    if (this.args.upgradingRepo) {
      return false;
    }

    // Disable other buttons when an upgrade is running
    if (this.upgradeStore.running) {
      return true;
    }

    // docker_manager has to be upgraded before other plugins
    return (
      !this.args.managerRepo.upToDate &&
      this.args.managerRepo !== this.args.repo
    );
  }

  get officialRepoBadge() {
    if (this.args.repo.fork) {
      return "exclamation-circle";
    } else if (this.args.repo.official) {
      return "check-circle";
    }
  }

  get officialRepoBadgeTitle() {
    if (this.args.repo.fork) {
      return I18n.t("admin.docker.forked_plugin");
    } else if (this.args.repo.official) {
      return I18n.t("admin.docker.official_plugin");
    }
  }

  get upgradeButtonLabel() {
    if (this.args.repo.upgrading) {
      return I18n.t("admin.docker.upgrading");
    } else {
      return I18n.t("admin.docker.upgrade_action");
    }
  }

  @action
  upgrade() {
    this.router.transitionTo("upgrade.show", this.args.repo);
  }
}
