package cmd

import (
	"context"
	"errors"

	"github.com/harbor-ml/modelzoo/go/schema"
	"github.com/harbor-ml/modelzoo/go/server"

	"github.com/spf13/cobra"
)

var doSeed bool
var seedPath string
var dbPath string

var grpcPort uint16
var staticPort uint16
var grpcWebPort uint16
var grpcHttpPort uint16
var prometheusPort uint16

// serveCmd represents the serve command
var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start the server",
	Args: func(cmd *cobra.Command, args []string) error {
		if doSeed && &seedPath == nil {
			return errors.New("Please pass in seed file path via --path")
		}
		return nil
	},
	Run: func(cmd *cobra.Command, args []string) {
		// Pass a do-nothing ctx for serving
		ctx := context.Background()

		if dbPath == "" {
			dbPath = server.CreateTempFile("*.db")
		}

		if doSeed {
			schema.Seed(seedPath, dbPath)
		}

		server.ServeForever(
			ctx,
			false, // use postgres
			dbPath,
			grpcPort,
			staticPort,
			grpcWebPort,
			grpcHttpPort,
			prometheusPort,
		)
	},
}

func init() {
	rootCmd.AddCommand(serveCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// serveCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	serveCmd.Flags().BoolVar(&doSeed, "seed", false, "Flag for seed the database")
	serveCmd.Flags().StringVar(&seedPath, "seedPath", "", "Path for seeding file")
	serveCmd.Flags().StringVar(&dbPath, "dbPath", "", "Path for the sqlitedb")

	serveCmd.Flags().Uint16Var(&grpcPort, "grpcPort", 9000, "Port for the gRPC server")
	serveCmd.Flags().Uint16Var(&staticPort, "staticPort", 3020, "Port for the static file server")
	serveCmd.Flags().Uint16Var(&grpcWebPort, "grpcWebPort", 8080, "Port for the gRPC frontend server")
	serveCmd.Flags().Uint16Var(&grpcHttpPort, "grpcHttpPort", 9090, "Port for the gRPC HTTP bridge server")
	serveCmd.Flags().Uint16Var(&prometheusPort, "prometheusPort", 9999, "Port for the prometheus server")
}
