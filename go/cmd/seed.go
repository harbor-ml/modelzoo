package cmd

import (
	"github.com/spf13/cobra"

	"github.com/harbor-ml/modelzoo/go/schema"
)

var dataPath *string

// seedCmd represents the seed command
var seedCmd = &cobra.Command{
	Use:   "seed",
	Short: "Seed the database",
	Long: `Create a dev database and fill in data

A SQLLite3 instance will be created by default.`,
	Run: func(cmd *cobra.Command, args []string) {
		schema.Seed(*dataPath, "/tmp/modelzoo.db")
	},
}

func init() {
	rootCmd.AddCommand(seedCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// seedCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	dataPath = seedCmd.Flags().String("data", "", "Path to models.json")
	seedCmd.MarkFlagRequired("data")
}
