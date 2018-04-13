import { expect } from "chai";

import { execAsync } from "@scrutiny/core/util";
import { ITestCallbackContext } from "mocha";

describe("CLI", () => {
  it("[INTEGRATION] (smoke test) CLI can analyse a package", async function testFunction(this: ITestCallbackContext) {
    // Setup
    this.timeout(30000);
    const packageSpecifiers: string[] = ['mana@0.1.41'];


    // Test
    let stdout = await execAsync(`npm run debug -- ${packageSpecifiers.join(' ')} --log-level=none`);

    // Assert
    expect(stdout).to.exist;
  });
});