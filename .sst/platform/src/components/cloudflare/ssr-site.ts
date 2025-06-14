import path from "path";
import fs from "fs";
import { Output, output, all, ComponentResourceOptions } from "@pulumi/pulumi";
import { Input } from "../input.js";
import { Component, transform, type Transform } from "../component.js";
import { VisibleError } from "../error.js";
import { BaseSsrSiteArgs, buildApp } from "../base/base-ssr-site.js";
import { Worker, WorkerArgs } from "./worker.js";
import { Link } from "../link.js";

export type Plan = {
  server: string;
  assets: string;
};

export interface SsrSiteArgs extends BaseSsrSiteArgs {
  domain?: Input<string>;
  /**
   * [Transform](/docs/components#transform) how this component creates its underlying
   * resources.
   */
  transform?: {
    /**
     * Transform the Worker component used for handling the server-side rendering.
     */
    server?: Transform<WorkerArgs>;
  };
}

export abstract class SsrSite extends Component implements Link.Linkable {
  private worker: Worker;

  protected abstract buildPlan(
    outputPath: Output<string>,
    name: string,
    args: SsrSiteArgs,
  ): Output<Plan>;

  constructor(
    type: string,
    name: string,
    args: SsrSiteArgs = {},
    opts: ComponentResourceOptions = {},
  ) {
    super(type, name, args, opts);
    const self = this;

    const sitePath = normalizeSitePath();
    const outputPath = $dev ? sitePath : buildApp(self, name, args, sitePath);
    const plan = validatePlan(this.buildPlan(outputPath, name, args));
    const worker = createWorker();

    this.worker = worker;

    this.registerOutputs({
      _hint: $dev ? undefined : this.url,
      _dev: {
        command: "npm run dev",
        directory: sitePath,
        autostart: true,
      },
      _metadata: {
        mode: $dev ? "placeholder" : "deployed",
        path: sitePath,
      },
    });

    function normalizeSitePath() {
      return output(args.path).apply((sitePath) => {
        if (!sitePath) return ".";

        if (!fs.existsSync(sitePath)) {
          throw new VisibleError(
            `Site directory not found at "${path.resolve(
              sitePath,
            )}". Please check the path setting in your configuration.`,
          );
        }
        return sitePath;
      });
    }

    function validatePlan(plan: Output<Plan>) {
      return plan;
    }

    function createWorker() {
      return new Worker(
        ...transform(
          args.transform?.server,
          `${name}Worker`,
          {
            handler: all([outputPath, plan.server]).apply(
              ([outputPath, server]) => path.join(outputPath, server),
            ),
            environment: args.environment,
            link: args.link,
            url: true,
            dev: false,
            domain: args.domain,
            assets: {
              directory: all([outputPath, plan.assets]).apply(
                ([outputPath, assets]) => path.join(outputPath, assets),
              ),
            },
            largePayload: true,
          },
          { parent: self },
        ),
      );
    }
  }

  /**
   * The URL of the Remix app.
   *
   * If the `domain` is set, this is the URL with the custom domain.
   * Otherwise, it's the auto-generated CloudFront URL.
   */
  public get url() {
    return this.worker.url;
  }

  /**
   * The underlying [resources](/docs/components/#nodes) this component creates.
   */
  public get nodes() {
    return {
      /**
       * The Cloudflare Worker that renders the site.
       */
      worker: this.worker,
    };
  }

  /** @internal */
  public getSSTLink() {
    return {
      properties: {
        url: this.url,
      },
    };
  }
}
