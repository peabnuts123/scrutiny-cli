import { argv } from 'yargs';

import { analyse, IScrutinyAnalysis } from '@scrutiny/analysis';
import { Logger, LogLevel, Timer } from '@scrutiny/core/util';

// Configure logger verbosity
Logger.setLogLevel(LogLevel.debug);

// Start timer for deep install details
Timer.start('DeepInstallDetails');

// Faux async block
(async () => {
  let scrutinyAnalysis: IScrutinyAnalysis = await analyse(...argv._);

  printSummary(scrutinyAnalysis);
  console.log("Successfully finished processing.");
})();

function printSummary(scrutinyAnalysis: IScrutinyAnalysis) {
  let elapsedTimeSeconds: number = Timer.stop('DeepInstallDetails');
  Logger.log(`Total processing time: ${elapsedTimeSeconds.toFixed(2)}s`);

  console.log();
  console.log(`Summary of installing ${argv._.length} package${argv._.length > 1 ? 's' : ''}: ${argv._.join(', ')}`);
  const INDENT = '   -';
  const LIST_INDENT = '         ';
  console.log(`${INDENT} Number of packages requested: ${argv._.length}`);
  console.log();
  console.log(`${INDENT} Number of packages installed (total): ${scrutinyAnalysis.meta.allInstalledPackages.length}`);
  console.log();
  console.log(`${INDENT} Number of packages installed successfully: ${scrutinyAnalysis.meta.successFullyInstalledPackages.length} (${percentage(scrutinyAnalysis.meta.successFullyInstalledPackages, scrutinyAnalysis.meta.allInstalledPackages)})`);
  console.log();
  console.log(`${INDENT} Number of packages with version < 0.1.0: ${scrutinyAnalysis.meta.alphaPackages.length} (${percentage(scrutinyAnalysis.meta.alphaPackages, scrutinyAnalysis.meta.allInstalledPackages)})`);
  if (scrutinyAnalysis.meta.alphaPackages.length > 0) {
    console.log(`${scrutinyAnalysis.meta.alphaPackages.map((pkg) => LIST_INDENT + pkg.PackageSpecifier).join('\n')}`);
  }
  console.log();
  console.log(`${INDENT} Number of packages with version between (0.1.0, 1.0.0): ${scrutinyAnalysis.meta.betaPackages.length} (${percentage(scrutinyAnalysis.meta.betaPackages, scrutinyAnalysis.meta.allInstalledPackages)})`);
  if (scrutinyAnalysis.meta.betaPackages.length > 0) {
    console.log(`${scrutinyAnalysis.meta.betaPackages.map((pkg) => LIST_INDENT + pkg.PackageSpecifier).join('\n')}`);
  }
  console.log();
  console.log(`${INDENT} Number of packages that failed to install: ${scrutinyAnalysis.meta.failedInstalledPackages.length} (${percentage(scrutinyAnalysis.meta.failedInstalledPackages, scrutinyAnalysis.meta.allInstalledPackages)})`);
  console.log();
  if (scrutinyAnalysis.meta.failedInstalledPackages.length > 0) {
    console.log(`${INDENT} Reasons why packages failed to install:`);
    console.log(`${scrutinyAnalysis.meta.failedInstalledPackages.map((pkg) => LIST_INDENT + pkg.name + ': ' + pkg.error).join('\n')}`);
    console.log();
    console.log(`${INDENT} Count of reasons why packages failed to install:`);
    console.log(`${scrutinyAnalysis.meta.installErrors.map((reason) => LIST_INDENT + reason.error + ': ' + reason.count).join('\n')}`);
    console.log();
  }
  console.log(`${INDENT} Number of unique publish authors: ${scrutinyAnalysis.authors.info.length}`);
  console.log();
  console.log(`${INDENT} Count of authors by number of packages published(relative to this install):`);
  console.log(`${scrutinyAnalysis.authors.info.map((authorSummary) => `${LIST_INDENT}${authorSummary.author}: ${authorSummary.publishedPackages.length} (${percentage(authorSummary.publishedPackages, scrutinyAnalysis.meta.allInstalledPackages, 1)})`).join('\n')}`);
  console.log();
}

function percentage(numeratorArray: any[], denominatorArray: any[], decimalPlaces: number = 0): string {
  return (numeratorArray.length / denominatorArray.length * 100).toFixed(decimalPlaces) + "%";
}
